import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsIn,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class NotificationPreferencesDto {
  @ApiPropertyOptional({ description: 'Enable push notifications' })
  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @ApiPropertyOptional({ description: 'Enable in-app notifications' })
  @IsOptional()
  @IsBoolean()
  inApp?: boolean;

  @ApiPropertyOptional({
    description: 'Enable analysis completion notifications',
  })
  @IsOptional()
  @IsBoolean()
  analysisComplete?: boolean;

  @ApiPropertyOptional({ description: 'Enable weekly summary notifications' })
  @IsOptional()
  @IsBoolean()
  weeklySummary?: boolean;
}

export class AnalysisDefaultsDto {
  @ApiPropertyOptional({
    description: 'Default analysis type',
    enum: ['full', 'quick', 'custom'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['full', 'quick', 'custom'])
  type?: string;

  @ApiPropertyOptional({ description: 'Include risk analysis by default' })
  @IsOptional()
  @IsBoolean()
  includeRisks?: boolean;

  @ApiPropertyOptional({ description: 'Include suggestions by default' })
  @IsOptional()
  @IsBoolean()
  includeSuggestions?: boolean;

  @ApiPropertyOptional({ description: 'Auto-analyze on upload' })
  @IsOptional()
  @IsBoolean()
  autoAnalyze?: boolean;
}

export class UpdatePreferencesDto {
  @ApiPropertyOptional({
    description: 'UI theme preference',
    enum: ['light', 'dark', 'auto'],
    default: 'light',
  })
  @IsOptional()
  @IsString()
  @IsIn(['light', 'dark', 'auto'])
  theme?: string;

  @ApiPropertyOptional({
    description: 'Language preference',
    enum: ['en', 'zh'],
    default: 'en',
  })
  @IsOptional()
  @IsString()
  @IsIn(['en', 'zh'])
  language?: string;

  @ApiPropertyOptional({ description: 'Enable email notifications' })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Notification preferences',
    type: NotificationPreferencesDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  notifications?: NotificationPreferencesDto;

  @ApiPropertyOptional({
    description: 'Default analysis settings',
    type: AnalysisDefaultsDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AnalysisDefaultsDto)
  analysisDefaults?: AnalysisDefaultsDto;
}
