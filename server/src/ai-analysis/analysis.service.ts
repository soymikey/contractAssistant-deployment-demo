import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue, Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { AiAnalysisService } from './ai-analysis.service';
import { DocumentService } from '../document/document.service';
import { StorageService } from '../upload/storage.service';
import { QUEUE_NAMES } from '../queues/queue-names.const';
import type {
  AnalysisResult,
  RiskItem as AIRiskItem,
} from './interfaces/analysis-result.interface';
import { promises as fs } from 'fs';

export interface SubmitAnalysisResult {
  jobId: string;
  analysisLogId: string;
  status: string;
  message: string;
}

export interface AnalysisStatusResult {
  id: string;
  contractId: string;
  status: string;
  progress: number;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
}

export interface AnalysisResultWithRisks {
  id: string;
  contractId: string;
  type: string;
  overviewData: any;
  suggestionsData: any;
  createdAt: Date;
  risks: {
    id: string;
    title: string;
    description: string;
    level: string;
    category?: string;
    suggestion?: string;
    clauseRef?: string;
  }[];
}

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiAnalysisService: AiAnalysisService,
    private readonly documentService: DocumentService,
    private readonly storageService: StorageService,
    @InjectQueue(QUEUE_NAMES.ANALYSIS) private readonly analysisQueue: Queue,
  ) {}

  /**
   * Submit a contract for analysis
   * Creates an analysis log and adds job to queue
   * @param contractId - Contract ID to analyze
   * @param userId - User ID requesting analysis
   * @returns Job submission result
   */
  async submitAnalysis(
    contractId: string,
    userId: string,
  ): Promise<SubmitAnalysisResult> {
    this.logger.log(`Submitting analysis for contract: ${contractId}`);

    // Verify contract exists and belongs to user
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to analyze this contract',
      );
    }

    // Check if there's already a pending/processing analysis
    const existingLog = await this.prisma.analysisLog.findFirst({
      where: {
        contractId,
        status: { in: ['pending', 'processing'] },
      },
    });

    if (existingLog) {
      throw new BadRequestException(
        'An analysis is already in progress for this contract',
      );
    }

    // Create analysis log
    const analysisLog = await this.prisma.analysisLog.create({
      data: {
        userId,
        contractId,
        status: 'pending',
        progress: 0,
      },
    });

    // Add job to queue
    const job = await this.analysisQueue.add(
      'analyze',
      {
        contractId,
        userId,
        analysisLogId: analysisLog.id,
        timestamp: new Date().toISOString(),
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    // Update contract status to processing
    await this.prisma.contract.update({
      where: { id: contractId },
      data: { status: 'processing' },
    });

    this.logger.log(
      `Analysis job ${job.id} submitted for contract: ${contractId}`,
    );

    return {
      jobId: String(job.id),
      analysisLogId: analysisLog.id,
      status: 'pending',
      message: 'Analysis job submitted successfully',
    };
  }

  /**
   * Process a contract analysis (called by queue processor)
   * @param contractId - Contract ID to analyze
   * @param userId - User ID
   * @param analysisLogId - Analysis log ID for progress tracking
   * @param job - Bull job for progress updates
   * @returns Analysis result
   */
  async processAnalysis(
    contractId: string,
    _userId: string,
    analysisLogId: string,
    job: Job,
  ): Promise<AnalysisResult> {
    this.logger.log(`Processing analysis for contract: ${contractId}`);

    try {
      // Update status to processing
      await this.updateAnalysisLog(analysisLogId, {
        status: 'processing',
        progress: 10,
      });
      await job.progress(10);

      // Get contract from database
      const contract = await this.prisma.contract.findUnique({
        where: { id: contractId },
      });

      if (!contract) {
        throw new NotFoundException('Contract not found');
      }

      await this.updateAnalysisLog(analysisLogId, { progress: 20 });
      await job.progress(20);

      // Read file from storage
      const filePath = this.storageService.getAbsoluteFilePath(
        contract.fileUrl,
      );
      const fileBuffer = await fs.readFile(filePath);

      // Create a mock Multer file object
      const multerFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: contract.fileName,
        encoding: '7bit',
        mimetype: contract.fileType,
        buffer: fileBuffer,
        size: contract.fileSize || fileBuffer.length,
        destination: '',
        filename: contract.fileName,
        path: filePath,
        stream: null as unknown as Express.Multer.File['stream'],
      };

      await this.updateAnalysisLog(analysisLogId, { progress: 30 });
      await job.progress(30);

      // Process document (extract text or prepare for multimodal)
      const processedDocument =
        await this.documentService.processDocument(multerFile);

      await this.updateAnalysisLog(analysisLogId, { progress: 50 });
      await job.progress(50);

      // Call AI for analysis
      const analysisResult =
        await this.aiAnalysisService.analyzeProcessedDocument(
          processedDocument,
        );

      await this.updateAnalysisLog(analysisLogId, { progress: 80 });
      await job.progress(80);

      // Store analysis results in database
      await this.storeAnalysisResults(contractId, analysisResult);

      // Update contract status to completed
      await this.prisma.contract.update({
        where: { id: contractId },
        data: { status: 'completed' },
      });

      // Update analysis log to completed
      await this.updateAnalysisLog(analysisLogId, {
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
      });
      await job.progress(100);

      this.logger.log(`Analysis completed for contract: ${contractId}`);

      return analysisResult;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Analysis failed for contract ${contractId}: ${errorMessage}`,
      );

      // Update statuses on failure
      await this.prisma.contract.update({
        where: { id: contractId },
        data: { status: 'failed' },
      });

      await this.updateAnalysisLog(analysisLogId, {
        status: 'failed',
        error: errorMessage,
        completedAt: new Date(),
      });

      throw error;
    }
  }

  /**
   * Store analysis results in database
   * @param contractId - Contract ID
   * @param result - AI analysis result
   */
  private async storeAnalysisResults(
    contractId: string,
    result: AnalysisResult,
  ): Promise<void> {
    // Prepare overview data as plain object for Prisma JSON field
    const overviewData = {
      summary: result.summary,
      riskLevel: result.riskLevel,
      keyTerms: result.keyTerms.map((term) => ({
        title: term.title,
        content: term.content,
        importance: term.importance,
      })),
      contractInfo: result.contractInfo
        ? {
            type: result.contractInfo.type,
            parties: result.contractInfo.parties,
            effectiveDate: result.contractInfo.effectiveDate,
            expirationDate: result.contractInfo.expirationDate,
            totalValue: result.contractInfo.totalValue,
          }
        : null,
      analyzedAt: result.analyzedAt,
    };

    // Prepare suggestions data as plain object
    const suggestionsData = {
      recommendations: [...result.recommendations],
    };

    // Create contract analysis record
    const analysis = await this.prisma.contractAnalysis.create({
      data: {
        contractId,
        type: 'full',
        overviewData,
        suggestionsData,
      },
    });

    // Create risk items
    if (result.risks && result.risks.length > 0) {
      await this.prisma.riskItem.createMany({
        data: result.risks.map((risk: AIRiskItem) => ({
          analysisId: analysis.id,
          title: risk.title,
          description: risk.description,
          level: risk.severity,
          category: risk.category || 'other',
          suggestion: risk.suggestion,
        })),
      });
    }

    this.logger.log(
      `Stored analysis results for contract ${contractId}: ${result.risks?.length || 0} risks`,
    );
  }

  /**
   * Update analysis log
   * @param analysisLogId - Analysis log ID
   * @param data - Data to update
   */
  private async updateAnalysisLog(
    analysisLogId: string,
    data: {
      status?: string;
      progress?: number;
      error?: string;
      completedAt?: Date;
    },
  ): Promise<void> {
    await this.prisma.analysisLog.update({
      where: { id: analysisLogId },
      data,
    });
  }

  /**
   * Get analysis status
   * @param analysisLogId - Analysis log ID
   * @param userId - User ID for permission check
   * @returns Analysis status
   */
  async getAnalysisStatus(
    analysisLogId: string,
    userId: string,
  ): Promise<AnalysisStatusResult> {
    const log = await this.prisma.analysisLog.findUnique({
      where: { id: analysisLogId },
    });

    if (!log) {
      throw new NotFoundException('Analysis log not found');
    }

    if (log.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this analysis',
      );
    }

    return {
      id: log.id,
      contractId: log.contractId,
      status: log.status,
      progress: log.progress,
      error: log.error || undefined,
      startedAt: log.startedAt,
      completedAt: log.completedAt || undefined,
    };
  }

  /**
   * Get analysis result by contract ID
   * @param contractId - Contract ID
   * @param userId - User ID for permission check
   * @returns Analysis result with risks
   */
  async getAnalysisResult(
    contractId: string,
    userId: string,
  ): Promise<AnalysisResultWithRisks | null> {
    // Verify contract belongs to user
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this analysis',
      );
    }

    // Get latest analysis
    const analysis = await this.prisma.contractAnalysis.findFirst({
      where: { contractId },
      orderBy: { createdAt: 'desc' },
      include: {
        risks: true,
      },
    });

    if (!analysis) {
      return null;
    }

    return {
      id: analysis.id,
      contractId: analysis.contractId,
      type: analysis.type,
      overviewData: analysis.overviewData,
      suggestionsData: analysis.suggestionsData,
      createdAt: analysis.createdAt,
      risks: analysis.risks.map((risk) => ({
        id: risk.id,
        title: risk.title,
        description: risk.description,
        level: risk.level,
        category: risk.category || undefined,
        suggestion: risk.suggestion || undefined,
        clauseRef: risk.clauseRef || undefined,
      })),
    };
  }

  /**
   * Get risks for a contract
   * @param contractId - Contract ID
   * @param userId - User ID for permission check
   * @returns Array of risk items
   */
  async getRisks(contractId: string, userId: string) {
    // Verify contract belongs to user
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this analysis',
      );
    }

    // Get latest analysis with risks
    const analysis = await this.prisma.contractAnalysis.findFirst({
      where: { contractId },
      orderBy: { createdAt: 'desc' },
      include: { risks: true },
    });

    if (!analysis) {
      return [];
    }

    return analysis.risks;
  }

  /**
   * Get analysis history for a contract
   * @param contractId - Contract ID
   * @param userId - User ID for permission check
   * @returns Array of analysis logs
   */
  async getAnalysisHistory(contractId: string, userId: string) {
    // Verify contract belongs to user
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this analysis',
      );
    }

    return this.prisma.analysisLog.findMany({
      where: { contractId },
      orderBy: { startedAt: 'desc' },
    });
  }
}
