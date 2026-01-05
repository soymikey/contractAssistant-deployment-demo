import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/types/authenticated-request.interface';
import { AiAnalysisService } from './ai-analysis.service';
import { AnalysisService } from './analysis.service';
import { AnalyzeContractDto } from './dto/analyze-contract.dto';
import {
  SubmitAnalysisDto,
  SubmitAnalysisResponseDto,
  AnalysisStatusDto,
  AnalysisResultDto,
  RiskItemDto,
  AnalysisHistoryItemDto,
} from './dto/analysis.dto';
import type { AnalysisResponse } from './interfaces/analysis-result.interface';

@Controller('analyses')
@ApiTags('Analysis')
export class AiAnalysisController {
  private readonly logger = new Logger(AiAnalysisController.name);

  constructor(
    private readonly aiAnalysisService: AiAnalysisService,
    private readonly analysisService: AnalysisService,
  ) {}

  /**
   * Submit a contract for analysis (queue-based)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Submit contract for analysis',
    description:
      'Submits a contract for AI analysis. The analysis is processed asynchronously via a job queue.',
  })
  @ApiResponse({
    status: 200,
    description: 'Analysis job submitted successfully',
    type: SubmitAnalysisResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @HttpCode(HttpStatus.OK)
  async submitAnalysis(
    @Body() submitDto: SubmitAnalysisDto,
    @CurrentUser() user: RequestUser,
  ): Promise<SubmitAnalysisResponseDto> {
    this.logger.log(
      `Received analysis request for contract: ${submitDto.contractId}`,
    );
    return this.analysisService.submitAnalysis(
      submitDto.contractId,
      user.userId,
    );
  }

  /**
   * Get analysis status
   */
  @Get('status/:analysisLogId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get analysis status',
    description: 'Returns the current status and progress of an analysis job.',
  })
  @ApiParam({ name: 'analysisLogId', description: 'Analysis log ID' })
  @ApiResponse({
    status: 200,
    description: 'Analysis status',
    type: AnalysisStatusDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Analysis log not found' })
  async getAnalysisStatus(
    @Param('analysisLogId') analysisLogId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<AnalysisStatusDto> {
    return this.analysisService.getAnalysisStatus(analysisLogId, user.userId);
  }

  /**
   * Get analysis result by contract ID
   */
  @Get('contract/:contractId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get analysis result',
    description: 'Returns the latest analysis result for a contract.',
  })
  @ApiParam({ name: 'contractId', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Analysis result',
    type: AnalysisResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async getAnalysisResult(
    @Param('contractId') contractId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<AnalysisResultDto | null> {
    return this.analysisService.getAnalysisResult(
      contractId,
      user.userId,
    ) as Promise<AnalysisResultDto | null>;
  }

  /**
   * Get risks for a contract
   */
  @Get('contract/:contractId/risks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get contract risks',
    description: 'Returns all identified risks for a contract.',
  })
  @ApiParam({ name: 'contractId', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'List of risks',
    type: [RiskItemDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async getRisks(
    @Param('contractId') contractId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<RiskItemDto[]> {
    return this.analysisService.getRisks(contractId, user.userId) as Promise<
      RiskItemDto[]
    >;
  }

  /**
   * Get analysis history for a contract
   */
  @Get('contract/:contractId/history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get analysis history',
    description: 'Returns the analysis history for a contract.',
  })
  @ApiParam({ name: 'contractId', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Analysis history',
    type: [AnalysisHistoryItemDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async getAnalysisHistory(
    @Param('contractId') contractId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<AnalysisHistoryItemDto[]> {
    return this.analysisService.getAnalysisHistory(
      contractId,
      user.userId,
    ) as Promise<AnalysisHistoryItemDto[]>;
  }

  /**
   * Direct image analysis (legacy endpoint for quick analysis)
   * This endpoint is for direct, synchronous analysis without queue
   */
  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze contract image directly',
    description:
      'Performs synchronous analysis on a base64-encoded contract image. Use the queue-based POST /analyses endpoint for production use.',
  })
  @ApiResponse({
    status: 200,
    description: 'Analysis result',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async analyzeContract(
    @Body() analyzeContractDto: AnalyzeContractDto,
  ): Promise<AnalysisResponse> {
    try {
      this.logger.log('Received direct contract analysis request');

      const result =
        await this.aiAnalysisService.analyzeContract(analyzeContractDto);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to analyze contract';
      this.logger.error('Error in analyzeContract endpoint:', errorMessage);

      return {
        success: false,
        data: null,
        message: errorMessage,
      };
    }
  }

  /**
   * Health check endpoint
   */
  @Post('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Health check',
    description: 'Check if the AI Analysis service is running.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
  })
  async healthCheck(): Promise<{ status: string; message: string }> {
    return {
      status: 'ok',
      message: 'AI Analysis service is running',
    };
  }
}
