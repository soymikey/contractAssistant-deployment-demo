import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto, PreferencesResponseDto } from './dto';

@Controller('preferences')
@ApiTags('Preferences')
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user preferences' })
  @ApiResponse({
    status: 200,
    description: 'User preferences',
    type: PreferencesResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async get(
    @CurrentUser('userId') userId: string,
  ): Promise<PreferencesResponseDto> {
    return this.preferencesService.get(userId);
  }

  @Put()
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({
    status: 200,
    description: 'Updated preferences',
    type: PreferencesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Body() updatePreferencesDto: UpdatePreferencesDto,
    @CurrentUser('userId') userId: string,
  ): Promise<PreferencesResponseDto> {
    return this.preferencesService.update(userId, updatePreferencesDto);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset preferences to defaults' })
  @ApiResponse({
    status: 200,
    description: 'Preferences reset to defaults',
    type: PreferencesResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async reset(
    @CurrentUser('userId') userId: string,
  ): Promise<PreferencesResponseDto> {
    return this.preferencesService.reset(userId);
  }
}
