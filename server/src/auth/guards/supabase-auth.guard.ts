import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RequestUser } from 'src/common/decorators/current-user.decorator';

export interface SupabaseAuthenticatedRequest extends Request {
  user: RequestUser;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      this.logger.error(
        'SUPABASE_URL or SUPABASE_ANON_KEY is not configured in environment variables',
      );
      throw new Error('Supabase configuration missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    this.logger.log('SupabaseAuthGuard initialized successfully');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<SupabaseAuthenticatedRequest>();

    // 1. Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      this.logger.warn('No authorization header provided');
      throw new UnauthorizedException('No token provided');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      this.logger.warn(`Invalid authorization header format: ${authHeader}`);
      throw new UnauthorizedException('Invalid token format');
    }

    const token = parts[1];
    if (!token) {
      this.logger.warn('Empty token in authorization header');
      throw new UnauthorizedException('Invalid token format');
    }

    // 2. Validate token with Supabase
    try {
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error) {
        this.logger.warn(
          `Supabase token validation failed: ${error.message}`,
          error,
        );
        throw new UnauthorizedException(
          `Invalid or expired token: ${error.message}`,
        );
      }

      if (!data.user) {
        this.logger.warn('No user data returned from Supabase');
        throw new UnauthorizedException('Invalid or expired token');
      }

      // 3. Map Supabase user to RequestUser format and attach to request
      request.user = {
        userId: data.user.id,
        email: data.user.email || '',
      };

      this.logger.debug(
        `User authenticated successfully: ${data.user.id} (${data.user.email})`,
      );

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error('Unexpected error during token validation:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
