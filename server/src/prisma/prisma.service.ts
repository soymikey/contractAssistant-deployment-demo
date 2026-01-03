import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

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
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
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
