import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module';
import { PrismaModule } from './prisma/prisma.module';
import { validationSchema } from './config/validation.schema';
import { HealthModule } from './health/health.module';
import { QueuesModule } from './queues/queues.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { DocumentModule } from './document/document.module';
import { ContractModule } from './contract/contract.module';
import { FavoriteModule } from './favorite/favorite.module';
import { PreferencesModule } from './preferences/preferences.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      cache: true, // Cache environment variables for better performance
      validationSchema, // Validate environment variables on startup
      validationOptions: {
        abortEarly: false, // Show all validation errors at once
        allowUnknown: true, // Allow extra environment variables
      },
    }),
    // Configure Bull Queue with Redis
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisPassword = configService.get<string>('REDIS_PASSWORD');
        const redisConfig: any = {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          maxRetriesPerRequest: null, // Recommended for Bull
          enableReadyCheck: false, // Recommended for Bull
        };

        // Only add password if it's defined and not empty
        if (redisPassword && redisPassword.trim() !== '') {
          redisConfig.password = redisPassword;
        }

        return {
          redis: redisConfig,
          defaultJobOptions: {
            removeOnComplete: 100, // Keep last 100 completed jobs
            removeOnFail: 500, // Keep last 500 failed jobs
            attempts: 3, // Retry failed jobs up to 3 times
            backoff: {
              type: 'exponential',
              delay: 2000, // Start with 2 second delay
            },
          },
        };
      },
    }),
    PrismaModule,
    AiAnalysisModule,
    HealthModule,
    QueuesModule,
    UserModule,
    UploadModule,
    ContractModule,
    DocumentModule,
    FavoriteModule,
    PreferencesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
