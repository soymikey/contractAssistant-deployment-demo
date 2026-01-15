// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { createClient } from '@supabase/supabase-js';
import { RequestUser } from 'src/common/decorators/current-user.decorator';

export interface SupabaseAuthenticatedRequest extends Request {
  user: RequestUser;
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const response = await this.supabase.auth.getUser(token);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (response.error || !response.data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 3. 将用户信息映射为 RequestUser 格式并挂载到 request
    // Supabase user 的 id 映射为 userId，email 保持不变
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const supabaseUser = response.data.user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    request.user = {
      userId: supabaseUser.id,
      email: supabaseUser.email || '',
    };
    return true;
  }
}
