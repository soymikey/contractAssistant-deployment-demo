/**
 * Configuration Service Example
 * This file demonstrates how to use ConfigService in your services
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigExampleService {
  constructor(private configService: ConfigService) {}

  // Get a single configuration value
  getDatabaseUrl(): string | undefined {
    return this.configService.get<string>('DATABASE_URL');
  }

  // Get configuration with default value
  getPort(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  // Get required configuration (throws error if not found)
  getJwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  // Check if in production
  isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  // Get array from comma-separated string
  getAllowedOrigins(): string[] {
    const origins = this.configService.get<string>('ALLOWED_ORIGINS', '');
    return origins.split(',').map((origin) => origin.trim());
  }
}
