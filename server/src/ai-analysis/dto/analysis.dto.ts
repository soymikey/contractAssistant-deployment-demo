import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnalysisDto {
  @ApiProperty({
    description: 'Contract ID to analyze',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  contractId: string;
}

export class SubmitAnalysisResponseDto {
  @ApiProperty({ description: 'Job ID in the queue' })
  jobId: string;

  @ApiProperty({ description: 'Analysis log ID for tracking progress' })
  analysisLogId: string;

  @ApiProperty({ description: 'Current status', example: 'pending' })
  status: string;

  @ApiProperty({ description: 'Response message' })
  message: string;
}

export class AnalysisStatusDto {
  @ApiProperty({ description: 'Analysis log ID' })
  id: string;

  @ApiProperty({ description: 'Contract ID' })
  contractId: string;

  @ApiProperty({
    description: 'Analysis status',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  status: string;

  @ApiProperty({ description: 'Progress percentage', minimum: 0, maximum: 100 })
  progress: number;

  @ApiProperty({ description: 'Error message if failed', required: false })
  error?: string;

  @ApiProperty({ description: 'Start time' })
  startedAt: Date;

  @ApiProperty({ description: 'Completion time', required: false })
  completedAt?: Date;
}

export class RiskItemDto {
  @ApiProperty({ description: 'Risk item ID' })
  id: string;

  @ApiProperty({ description: 'Risk title' })
  title: string;

  @ApiProperty({ description: 'Risk description' })
  description: string;

  @ApiProperty({ description: 'Risk level', enum: ['high', 'medium', 'low'] })
  level: string;

  @ApiProperty({
    description: 'Risk category',
    enum: ['legal', 'financial', 'operational', 'compliance', 'other'],
    required: false,
  })
  category?: string;

  @ApiProperty({ description: 'Improvement suggestion', required: false })
  suggestion?: string;

  @ApiProperty({ description: 'Clause reference', required: false })
  clauseRef?: string;
}

export class KeyTermDto {
  @ApiProperty({ description: 'Key term title' })
  title: string;

  @ApiProperty({ description: 'Key term content' })
  content: string;

  @ApiProperty({
    description: 'Importance level',
    enum: ['critical', 'important', 'normal'],
  })
  importance: string;
}

export class ContractInfoDto {
  @ApiProperty({ description: 'Contract type', required: false })
  type?: string;

  @ApiProperty({ description: 'Contract parties', required: false })
  parties?: string[];

  @ApiProperty({ description: 'Effective date', required: false })
  effectiveDate?: string;

  @ApiProperty({ description: 'Expiration date', required: false })
  expirationDate?: string;

  @ApiProperty({ description: 'Total contract value', required: false })
  totalValue?: string;
}

export class OverviewDataDto {
  @ApiProperty({ description: 'Analysis summary' })
  summary: string;

  @ApiProperty({
    description: 'Overall risk level',
    enum: ['high', 'medium', 'low'],
  })
  riskLevel: string;

  @ApiProperty({ description: 'Key terms', type: [KeyTermDto] })
  keyTerms: KeyTermDto[];

  @ApiProperty({ description: 'Contract information', required: false })
  contractInfo?: ContractInfoDto;

  @ApiProperty({ description: 'Analysis timestamp' })
  analyzedAt: string;
}

export class SuggestionsDataDto {
  @ApiProperty({ description: 'Recommendations list' })
  recommendations: string[];
}

export class AnalysisResultDto {
  @ApiProperty({ description: 'Analysis ID' })
  id: string;

  @ApiProperty({ description: 'Contract ID' })
  contractId: string;

  @ApiProperty({ description: 'Analysis type', example: 'full' })
  type: string;

  @ApiProperty({ description: 'Overview data' })
  overviewData: OverviewDataDto;

  @ApiProperty({ description: 'Suggestions data' })
  suggestionsData: SuggestionsDataDto;

  @ApiProperty({ description: 'Creation time' })
  createdAt: Date;

  @ApiProperty({ description: 'Risk items', type: [RiskItemDto] })
  risks: RiskItemDto[];
}

export class AnalysisHistoryItemDto {
  @ApiProperty({ description: 'Analysis log ID' })
  id: string;

  @ApiProperty({ description: 'Contract ID' })
  contractId: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({
    description: 'Analysis status',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  status: string;

  @ApiProperty({ description: 'Progress percentage' })
  progress: number;

  @ApiProperty({ description: 'Error message', required: false })
  error?: string;

  @ApiProperty({ description: 'Start time' })
  startedAt: Date;

  @ApiProperty({ description: 'Completion time', required: false })
  completedAt?: Date;
}
