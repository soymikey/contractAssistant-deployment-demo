import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { StorageService } from './storage.service';
import { PrismaModule } from '../prisma/prisma.module';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [PrismaModule, QueuesModule],
  controllers: [UploadController],
  providers: [UploadService, StorageService],
  exports: [UploadService, StorageService],
})
export class UploadModule {}
