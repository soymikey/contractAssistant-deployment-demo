import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue, JobOptions } from 'bull';
import { QUEUE_NAMES } from './queue-names.const';

/**
 * Service for managing Bull queues across the application
 */
@Injectable()
export class QueuesService {
  private readonly logger = new Logger(QueuesService.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.ANALYSIS) private analysisQueue: Queue,
    @InjectQueue(QUEUE_NAMES.UPLOAD) private uploadQueue: Queue,
    @InjectQueue(QUEUE_NAMES.OCR) private ocrQueue: Queue,
    @InjectQueue(QUEUE_NAMES.NOTIFICATION) private notificationQueue: Queue,
  ) {}

  /**
   * Add a contract analysis job to the queue
   */
  async addAnalysisJob(
    contractId: string,
    userId: string,
    options?: JobOptions,
  ) {
    this.logger.log(`Adding analysis job for contract: ${contractId}`);
    return this.analysisQueue.add(
      'analyze',
      { contractId, userId, timestamp: new Date().toISOString() },
      options,
    );
  }

  /**
   * Add a file upload processing job to the queue
   */
  async addUploadJob(
    fileId: string,
    userId: string,
    fileType: string,
    options?: JobOptions,
  ) {
    this.logger.log(`Adding upload job for file: ${fileId}`);
    return this.uploadQueue.add(
      'process-upload',
      { fileId, userId, fileType, timestamp: new Date().toISOString() },
      options,
    );
  }

  /**
   * Add an OCR job to the queue
   */
  async addOcrJob(fileId: string, userId: string, options?: JobOptions) {
    this.logger.log(`Adding OCR job for file: ${fileId}`);
    return this.ocrQueue.add(
      'recognize',
      { fileId, userId, timestamp: new Date().toISOString() },
      options,
    );
  }

  /**
   * Add a notification job to the queue
   */
  async addNotificationJob(
    type: 'email' | 'push',
    recipient: string,
    data: any,
    options?: JobOptions,
  ) {
    this.logger.log(`Adding ${type} notification job for: ${recipient}`);
    return this.notificationQueue.add(
      type,
      { recipient, data, timestamp: new Date().toISOString() },
      options,
    );
  }

  /**
   * Get queue statistics for monitoring
   */
  async getQueueStats(queueName: keyof typeof QUEUE_NAMES) {
    const queue = this.getQueue(queueName);
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      queueName: QUEUE_NAMES[queueName],
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }

  /**
   * Get all queues statistics
   */
  async getAllQueueStats() {
    const stats = await Promise.all([
      this.getQueueStats('ANALYSIS'),
      this.getQueueStats('UPLOAD'),
      this.getQueueStats('OCR'),
      this.getQueueStats('NOTIFICATION'),
    ]);

    return stats;
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: keyof typeof QUEUE_NAMES) {
    const queue = this.getQueue(queueName);
    await queue.pause();
    this.logger.warn(`Queue ${QUEUE_NAMES[queueName]} paused`);
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName: keyof typeof QUEUE_NAMES) {
    const queue = this.getQueue(queueName);
    await queue.resume();
    this.logger.log(`Queue ${QUEUE_NAMES[queueName]} resumed`);
  }

  /**
   * Clean completed jobs from a queue
   */
  async cleanQueue(queueName: keyof typeof QUEUE_NAMES, grace: number = 0) {
    const queue = this.getQueue(queueName);
    await queue.clean(grace, 'completed');
    await queue.clean(grace, 'failed');
    this.logger.log(`Queue ${QUEUE_NAMES[queueName]} cleaned`);
  }

  /**
   * Get a specific queue instance
   */
  private getQueue(queueName: keyof typeof QUEUE_NAMES): Queue {
    switch (queueName) {
      case 'ANALYSIS':
        return this.analysisQueue;
      case 'UPLOAD':
        return this.uploadQueue;
      case 'OCR':
        return this.ocrQueue;
      case 'NOTIFICATION':
        return this.notificationQueue;
      default:
        throw new Error(`Unknown queue: ${queueName}`);
    }
  }
}
