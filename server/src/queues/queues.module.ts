import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueuesService } from './queues.service';
import { QUEUE_NAMES } from './queue-names.const';
import { AnalysisProcessor } from './processors/analysis.processor';
import {
  UploadProcessor,
  OcrProcessor,
  NotificationProcessor,
} from './processors';
import { AiAnalysisModule } from '../ai-analysis/ai-analysis.module';

export { QUEUE_NAMES } from './queue-names.const';

@Module({
  imports: [
    // Import AiAnalysisModule for AnalysisProcessor
    forwardRef(() => AiAnalysisModule),
    // Register analysis queue for AI contract analysis
    BullModule.registerQueue({
      name: QUEUE_NAMES.ANALYSIS,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000, // 3 seconds
        },
        removeOnComplete: 50,
        removeOnFail: 200,
      },
    }),
    // Register upload queue for file processing
    BullModule.registerQueue({
      name: QUEUE_NAMES.UPLOAD,
      defaultJobOptions: {
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 2000, // 2 seconds
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    }),
    // Register OCR queue for text extraction
    BullModule.registerQueue({
      name: QUEUE_NAMES.OCR,
      defaultJobOptions: {
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 5000, // 5 seconds
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    }),
    // Register notification queue for sending emails/push notifications
    BullModule.registerQueue({
      name: QUEUE_NAMES.NOTIFICATION,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000, // 1 second
        },
        removeOnComplete: 200,
        removeOnFail: 50,
      },
    }),
  ],
  providers: [
    QueuesService,
    AnalysisProcessor,
    UploadProcessor,
    OcrProcessor,
    NotificationProcessor,
  ],
  exports: [BullModule, QueuesService],
})
export class QueuesModule {}
