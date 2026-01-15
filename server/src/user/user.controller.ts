import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  type SupabaseAuthenticatedRequest,
  SupabaseAuthGuard,
} from 'src/auth/guards/supabase-auth.guard';
import { RequestUser } from 'src/common/decorators/current-user.decorator';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Get current user info (by token)' })
  @ApiResponse({
    status: 200,
    description: 'Current user info from Supabase authentication',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        email: { type: 'string', description: 'User email' },
      },
    },
  })
  async getProfile(
    @Request() req: SupabaseAuthenticatedRequest,
  ): Promise<RequestUser> {
    // Return the authenticated user info from Supabase JWT token
    return req.user;
  }
}
