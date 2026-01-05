import { Injectable, Logger } from '@nestjs/common';
import type { Prisma, UserPreferences } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdatePreferencesDto, PreferencesResponseDto } from './dto';

// Default preferences for new users
const DEFAULT_PREFERENCES = {
  theme: 'light',
  language: 'en',
  emailNotifications: true,
  notifications: {
    push: true,
    inApp: true,
    analysisComplete: true,
    weeklySummary: false,
  },
  analysisDefaults: {
    type: 'full',
    includeRisks: true,
    includeSuggestions: true,
    autoAnalyze: false,
  },
};

@Injectable()
export class PreferencesService {
  private readonly logger = new Logger(PreferencesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user preferences (creates default if not exists)
   */
  async get(userId: string): Promise<PreferencesResponseDto> {
    this.logger.log(`Getting preferences for user: ${userId}`);

    let preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    // Create default preferences if not exists
    if (!preferences) {
      this.logger.log(`Creating default preferences for user: ${userId}`);
      preferences = await this.prisma.userPreferences.create({
        data: {
          userId,
          theme: DEFAULT_PREFERENCES.theme,
          language: DEFAULT_PREFERENCES.language,
          emailNotifications: DEFAULT_PREFERENCES.emailNotifications,
          notifications: DEFAULT_PREFERENCES.notifications,
          analysisDefaults: DEFAULT_PREFERENCES.analysisDefaults,
        },
      });
    }

    return this.mapToResponse(preferences);
  }

  /**
   * Update user preferences
   */
  async update(
    userId: string,
    updateDto: UpdatePreferencesDto,
  ): Promise<PreferencesResponseDto> {
    this.logger.log(`Updating preferences for user: ${userId}`);

    // Ensure preferences exist first
    const existing = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    let preferences: UserPreferences;

    if (!existing) {
      // Create with provided values merged with defaults
      // Convert DTO to JSON-compatible object by spreading
      const notificationsData: Prisma.InputJsonValue = updateDto.notifications
        ? { ...updateDto.notifications }
        : DEFAULT_PREFERENCES.notifications;
      const analysisDefaultsData: Prisma.InputJsonValue =
        updateDto.analysisDefaults
          ? { ...updateDto.analysisDefaults }
          : DEFAULT_PREFERENCES.analysisDefaults;

      preferences = await this.prisma.userPreferences.create({
        data: {
          userId,
          theme: updateDto.theme ?? DEFAULT_PREFERENCES.theme,
          language: updateDto.language ?? DEFAULT_PREFERENCES.language,
          emailNotifications:
            updateDto.emailNotifications ??
            DEFAULT_PREFERENCES.emailNotifications,
          notifications: notificationsData,
          analysisDefaults: analysisDefaultsData,
        },
      });
    } else {
      // Update existing preferences
      const updateData: Record<string, unknown> = {};

      if (updateDto.theme !== undefined) {
        updateData.theme = updateDto.theme;
      }
      if (updateDto.language !== undefined) {
        updateData.language = updateDto.language;
      }
      if (updateDto.emailNotifications !== undefined) {
        updateData.emailNotifications = updateDto.emailNotifications;
      }
      if (updateDto.notifications !== undefined) {
        // Merge with existing notifications
        const existingNotifications =
          (existing.notifications as Record<string, unknown>) ?? {};
        updateData.notifications = {
          ...existingNotifications,
          ...updateDto.notifications,
        };
      }
      if (updateDto.analysisDefaults !== undefined) {
        // Merge with existing analysis defaults
        const existingDefaults =
          (existing.analysisDefaults as Record<string, unknown>) ?? {};
        updateData.analysisDefaults = {
          ...existingDefaults,
          ...updateDto.analysisDefaults,
        };
      }

      preferences = await this.prisma.userPreferences.update({
        where: { userId },
        data: updateData,
      });
    }

    this.logger.log(`Preferences updated for user: ${userId}`);

    return this.mapToResponse(preferences);
  }

  /**
   * Reset preferences to defaults
   */
  async reset(userId: string): Promise<PreferencesResponseDto> {
    this.logger.log(`Resetting preferences for user: ${userId}`);

    const preferences = await this.prisma.userPreferences.upsert({
      where: { userId },
      create: {
        userId,
        theme: DEFAULT_PREFERENCES.theme,
        language: DEFAULT_PREFERENCES.language,
        emailNotifications: DEFAULT_PREFERENCES.emailNotifications,
        notifications: DEFAULT_PREFERENCES.notifications,
        analysisDefaults: DEFAULT_PREFERENCES.analysisDefaults,
      },
      update: {
        theme: DEFAULT_PREFERENCES.theme,
        language: DEFAULT_PREFERENCES.language,
        emailNotifications: DEFAULT_PREFERENCES.emailNotifications,
        notifications: DEFAULT_PREFERENCES.notifications,
        analysisDefaults: DEFAULT_PREFERENCES.analysisDefaults,
      },
    });

    this.logger.log(`Preferences reset for user: ${userId}`);

    return this.mapToResponse(preferences);
  }

  /**
   * Map database entity to response DTO
   */
  private mapToResponse(preferences: UserPreferences): PreferencesResponseDto {
    return {
      id: preferences.id,
      userId: preferences.userId,
      theme: preferences.theme,
      language: preferences.language,
      emailNotifications: preferences.emailNotifications,
      notifications:
        preferences.notifications as PreferencesResponseDto['notifications'],
      analysisDefaults:
        preferences.analysisDefaults as PreferencesResponseDto['analysisDefaults'],
      createdAt: preferences.createdAt,
      updatedAt: preferences.updatedAt,
    };
  }
}
