import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module';
import { PrismaModule } from './prisma/prisma.module';
import { validationSchema } from './config/validation.schema';
import { HealthModule } from './health/health.module';

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
    PrismaModule,
    AiAnalysisModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
