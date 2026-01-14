import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './entities';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';

interface SupabaseAuthenticatedRequest extends Request {
  user: UserEntity;
}

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Get current user info (by token)' })
  @ApiResponse({
    status: 200,
    description: 'Current user info',
    type: UserEntity,
  })
  async getProfile(
    @Request() req: SupabaseAuthenticatedRequest,
  ): Promise<UserEntity> {
    const user = req.user; // 这里就是 Supabase 用户信息
    return user;
  }
}
