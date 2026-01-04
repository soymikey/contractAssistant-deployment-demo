import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dto';
import { UserEntity } from './entities';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        avatar: createUserDto.avatar || null,
      },
    });

    return new UserEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => new UserEntity(user));
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserEntity(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return new UserEntity(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<UserEntity> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check permission - users can only update their own profile
    if (user.id !== currentUserId) {
      throw new ForbiddenException(
        'You do not have permission to update this user',
      );
    }

    // If email is being changed, check if new email is already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email is already taken');
      }
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        avatar: updateUserDto.avatar,
      },
    });

    return new UserEntity(updatedUser);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
    currentUserId: string,
  ): Promise<{ message: string }> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check permission
    if (user.id !== currentUserId) {
      throw new ForbiddenException(
        'You do not have permission to change this password',
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password changed successfully' };
  }

  async remove(
    id: string,
    currentUserId: string,
  ): Promise<{ message: string }> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check permission
    if (user.id !== currentUserId) {
      throw new ForbiddenException(
        'You do not have permission to delete this user',
      );
    }

    // Delete user (cascade will handle related records)
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  // Utility method for authentication (will be used by AuthService)
  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return new UserEntity(user);
  }
}
