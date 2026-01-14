// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { createClient } from '@supabase/supabase-js';
import { UserEntity } from 'src/user/entities';

export interface SupabaseAuthenticatedRequest extends Request {
  user: UserEntity;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || '',
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<SupabaseAuthenticatedRequest>();
    // 1. 从 Header 提取 Token
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    // 2. 调用 Supabase 获取用户
    // 注意：getUser 会自动验证 JWT 的签名和过期时间
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 3. 将用户信息挂载到 request，方便 Controller 使用
    request.user = user as unknown as UserEntity;
    return true;
  }
}
