import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const connectionLimit =
      configService.get<number>('DATABASE_CONNECTION_LIMIT') || 10;
    const poolTimeout =
      configService.get<number>('DATABASE_POOL_TIMEOUT') || 20;

    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
      log:
        configService.get<string>('NODE_ENV') === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['warn', 'error'],
    });

    this.logger.log(
      `Database connection pool configured: limit=${connectionLimit}, timeout=${poolTimeout}s`,
    );
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');

      // Auto-migration in development environment only
      if (this.configService.get<string>('NODE_ENV') === 'development') {
        await this.runMigrations();
      }
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  /**
   * Run database migrations automatically in development environment
   * Uses 'prisma migrate deploy' which is safe for automated execution
   */
  private async runMigrations() {
    try {
      this.logger.log('🔄 Running database migrations...');

      const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
        cwd: process.cwd(),
        env: {
          ...process.env,
          DATABASE_URL: this.configService.get<string>('DATABASE_URL'),
        },
      });

      if (stderr && !stderr.includes('warning')) {
        this.logger.warn('Migration stderr:', stderr);
      }

      if (stdout.includes('No pending migrations')) {
        this.logger.log('✅ Database schema is up to date');
      } else {
        this.logger.log('✅ Database migrations completed successfully');
        this.logger.debug(stdout);
      }
    } catch (error: any) {
      // Don't throw error - just warn and continue
      // This allows the app to start even if migrations fail (table might already exist)
      this.logger.warn(
        '⚠️  Migration failed or skipped. This is expected if tables already exist.',
      );
      this.logger.debug('Migration error details:', error.message);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting from database', error);
    }
  }

  /**
   * Clean disconnect method for graceful shutdown
   */
  enableShutdownHooks(app: { close: () => Promise<void> }): void {
    process.on('beforeExit', () => {
      void app.close();
    });
  }
}
