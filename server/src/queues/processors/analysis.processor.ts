import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import type { Job } from 'bull';
import { QUEUE_NAMES } from '../queue-names.const';
import { AnalysisService } from '../../ai-analysis/analysis.service';

interface AnalysisJobData {
  contractId: string;
  userId: string;
  analysisLogId: string;
  timestamp: string;
}

interface AnalysisJobResult {
  contractId: string;
  userId: string;
  status: string;
  completedAt: string;
}

/**
 * Processor for handling contract analysis jobs
 * Integrates with AnalysisService for actual analysis processing
 */
@Processor(QUEUE_NAMES.ANALYSIS)
export class AnalysisProcessor {
  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(
    @Inject(forwardRef(() => AnalysisService))
    private readonly analysisService: AnalysisService,
  ) {}

  /**
   * Process contract analysis job
   */
  @Process('analyze')
  async handleAnalysis(job: Job<AnalysisJobData>): Promise<AnalysisJobResult> {
    const { contractId, userId, analysisLogId } = job.data;

    this.logger.log(
      `Processing analysis job ${job.id} for contract: ${contractId}`,
    );

    try {
      // Call the analysis service to process the contract
      await this.analysisService.processAnalysis(
        contractId,
        userId,
        analysisLogId,
        job,
      );

      this.logger.log(
        `Successfully completed analysis for contract: ${contractId}`,
      );

      return {
        contractId,
        userId,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to analyze contract ${contractId}: ${errorMessage}`,
      );
      throw error;
    }
  }

  /**
   * Event handler for when a job becomes active
   */
  @OnQueueActive()
  onActive(job: Job<AnalysisJobData>) {
    this.logger.log(
      `Job ${job.id} is now active. Processing contract: ${job.data.contractId}`,
    );
  }

  /**
   * Event handler for when a job is completed
   */
  @OnQueueCompleted()
  onCompleted(job: Job<AnalysisJobData>, result: AnalysisJobResult) {
    this.logger.log(
      `Job ${job.id} completed successfully for contract: ${result.contractId}`,
    );

    // TODO: Send notification to user about completion (Week 6)
  }

  /**
   * Event handler for when a job fails
   */
  @OnQueueFailed()
  onFailed(job: Job<AnalysisJobData>, error: Error) {
    this.logger.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts. Contract: ${job.data.contractId}. Error: ${error.message}`,
    );

    // TODO: Send notification to user about failure (Week 6)
    // TODO: Log error to monitoring service (Sentry) (Week 7)
  }
}
