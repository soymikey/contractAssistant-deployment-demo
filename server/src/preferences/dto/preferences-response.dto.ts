import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NotificationPreferencesDto,
  AnalysisDefaultsDto,
} from './update-preferences.dto';

export class PreferencesResponseDto {
  @ApiProperty({ description: 'Preferences ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({
    description: 'UI theme preference',
    enum: ['light', 'dark', 'auto'],
    default: 'light',
  })
  theme: string;

  @ApiProperty({
    description: 'Language preference',
    enum: ['en', 'zh'],
    default: 'en',
  })
  language: string;

  @ApiProperty({ description: 'Enable email notifications' })
  emailNotifications: boolean;

  @ApiPropertyOptional({
    description: 'Notification preferences',
    type: NotificationPreferencesDto,
  })
  notifications?: NotificationPreferencesDto | null;

  @ApiPropertyOptional({
    description: 'Default analysis settings',
    type: AnalysisDefaultsDto,
  })
  analysisDefaults?: AnalysisDefaultsDto | null;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
