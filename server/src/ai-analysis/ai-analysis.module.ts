import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AiAnalysisController } from './ai-analysis.controller';
import { AiAnalysisService } from './ai-analysis.service';
import { AnalysisService } from './analysis.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DocumentModule } from '../document/document.module';
import { UploadModule } from '../upload/upload.module';
import { QUEUE_NAMES } from '../queues/queue-names.const';

@Module({
  imports: [
    PrismaModule,
    DocumentModule,
    forwardRef(() => UploadModule),
    // Register analysis queue for this module
    BullModule.registerQueue({
      name: QUEUE_NAMES.ANALYSIS,
    }),
  ],
  controllers: [AiAnalysisController],
  providers: [AiAnalysisService, AnalysisService],
  exports: [AiAnalysisService, AnalysisService],
})
export class AiAnalysisModule {}
