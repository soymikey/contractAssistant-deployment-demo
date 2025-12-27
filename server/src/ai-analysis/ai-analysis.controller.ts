import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AiAnalysisService } from './ai-analysis.service';
import { AnalyzeContractDto } from './dto/analyze-contract.dto';
import { AnalysisResponse } from './interfaces/analysis-result.interface';

@Controller('ai-analysis')
export class AiAnalysisController {
  private readonly logger = new Logger(AiAnalysisController.name);

  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  async analyzeContract(
    @Body() analyzeContractDto: AnalyzeContractDto,
  ): Promise<AnalysisResponse> {
    try {
      this.logger.log('Received contract analysis request');

      const result =
        await this.aiAnalysisService.analyzeContract(analyzeContractDto);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Error in analyzeContract endpoint:', error.message);

      return {
        success: false,
        data: null,
        message: error.message || 'Failed to analyze contract',
      };
    }
  }

  @Post('health')
  @HttpCode(HttpStatus.OK)
  async healthCheck(): Promise<{ status: string; message: string }> {
    return {
      status: 'ok',
      message: 'AI Analysis service is running',
    };
  }
}
