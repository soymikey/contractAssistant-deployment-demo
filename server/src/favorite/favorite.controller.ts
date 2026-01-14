import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FavoriteService } from './favorite.service';
import {
  CreateFavoriteDto,
  FavoriteResponseDto,
  FavoriteCheckResponseDto,
} from './dto';

@Controller('favorites')
@ApiTags('Favorites')
@UseGuards(SupabaseAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @ApiOperation({ summary: 'Add a contract to favorites' })
  @ApiResponse({
    status: 201,
    description: 'Contract added to favorites',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your contract' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @ApiResponse({ status: 409, description: 'Contract already favorited' })
  async create(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @CurrentUser('userId') userId: string,
  ): Promise<FavoriteResponseDto> {
    return this.favoriteService.create(createFavoriteDto.contractId, userId);
  }

  @Delete(':contractId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a contract from favorites' })
  @ApiParam({ name: 'contractId', description: 'Contract ID to unfavorite' })
  @ApiResponse({ status: 204, description: 'Contract removed from favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  async remove(
    @Param('contractId') contractId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.favoriteService.remove(contractId, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all favorites for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of favorites',
    type: [FavoriteResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @CurrentUser('userId') userId: string,
  ): Promise<FavoriteResponseDto[]> {
    return this.favoriteService.findAll(userId);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get favorites count for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Favorites count',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async count(
    @CurrentUser('userId') userId: string,
  ): Promise<{ count: number }> {
    const count = await this.favoriteService.count(userId);
    return { count };
  }

  @Get(':contractId')
  @ApiOperation({ summary: 'Check if a contract is favorited' })
  @ApiParam({ name: 'contractId', description: 'Contract ID to check' })
  @ApiResponse({
    status: 200,
    description: 'Favorite status',
    type: FavoriteCheckResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async check(
    @Param('contractId') contractId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<FavoriteCheckResponseDto> {
    return this.favoriteService.isFavorited(contractId, userId);
  }

  @Post(':contractId/toggle')
  @ApiOperation({ summary: 'Toggle favorite status for a contract' })
  @ApiParam({ name: 'contractId', description: 'Contract ID to toggle' })
  @ApiResponse({
    status: 200,
    description: 'Updated favorite status',
    schema: {
      type: 'object',
      properties: {
        isFavorited: { type: 'boolean' },
        favorite: { $ref: '#/components/schemas/FavoriteResponseDto' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your contract' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  async toggle(
    @Param('contractId') contractId: string,
    @CurrentUser('userId') userId: string,
  ): Promise<{ isFavorited: boolean; favorite?: FavoriteResponseDto }> {
    return this.favoriteService.toggle(contractId, userId);
  }
}
