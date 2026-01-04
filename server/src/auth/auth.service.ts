import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';
import { UserEntity } from '../user/entities';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserEntity;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.validateUserCredentials(
      email,
      password,
    );
    return user;
  }

  async login(user: UserEntity): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.userService.create(createUserDto);
    return this.login(user);
  }

  async refreshToken(user: UserEntity): Promise<AuthResponse> {
    return this.login(user);
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getUserFromToken(token: string): Promise<UserEntity | null> {
    const payload = await this.validateToken(token);
    if (!payload) {
      return null;
    }
    return this.userService.findOne(payload.sub);
  }

  /**
   * Generate a password reset token for the user
   * @param email - User's email address
   * @returns Message indicating email was sent
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    // Find user by email
    const user = await this.userService.findByEmail(email);

    if (!user) {
      // For security reasons, don't reveal if email exists
      // Return success message even if user not found
      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing in database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expiration time (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Delete any existing unused tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        used: false,
      },
    });

    // Create new reset token
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
        used: false,
      },
    });

    // TODO: Send email with reset link
    // For now, we'll log the token (in production, this would be sent via email)
    console.log('Password Reset Token (send via email):', resetToken);
    console.log(
      'Reset URL:',
      `http://localhost:3000/reset-password?token=${resetToken}`,
    );

    return {
      message: 'If the email exists, a password reset link has been sent.',
    };
  }

  /**
   * Reset user password using the reset token
   * @param token - Reset token from email
   * @param newPassword - New password
   * @returns Message indicating success
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    // Hash the provided token to match against database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the reset token in database
    const resetTokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    // Validate token exists
    if (!resetTokenRecord) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token is already used
    if (resetTokenRecord.used) {
      throw new BadRequestException('Reset token has already been used');
    }

    // Check if token is expired
    if (new Date() > resetTokenRecord.expiresAt) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await this.prisma.user.update({
      where: { id: resetTokenRecord.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await this.prisma.passwordResetToken.update({
      where: { id: resetTokenRecord.id },
      data: { used: true },
    });

    return {
      message:
        'Password has been reset successfully. You can now login with your new password.',
    };
  }
}
