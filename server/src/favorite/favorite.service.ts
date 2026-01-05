import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { FavoriteResponseDto, FavoriteCheckResponseDto } from './dto';

@Injectable()
export class FavoriteService {
  private readonly logger = new Logger(FavoriteService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Add a contract to user's favorites
   */
  async create(
    contractId: string,
    userId: string,
  ): Promise<FavoriteResponseDto> {
    this.logger.log(`Adding favorite: user=${userId}, contract=${contractId}`);

    // Check if contract exists and belongs to user
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.userId !== userId) {
      throw new ForbiddenException('You can only favorite your own contracts');
    }

    // Check if already favorited
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_contractId: {
          userId,
          contractId,
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Contract is already favorited');
    }

    // Create favorite
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        contractId,
      },
      include: {
        contract: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    this.logger.log(`Favorite created: id=${favorite.id}`);

    return {
      id: favorite.id,
      userId: favorite.userId,
      contractId: favorite.contractId,
      createdAt: favorite.createdAt,
      contract: favorite.contract,
    };
  }

  /**
   * Remove a contract from user's favorites
   */
  async remove(contractId: string, userId: string): Promise<void> {
    this.logger.log(
      `Removing favorite: user=${userId}, contract=${contractId}`,
    );

    // Check if favorite exists
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_contractId: {
          userId,
          contractId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    // Delete favorite
    await this.prisma.favorite.delete({
      where: {
        userId_contractId: {
          userId,
          contractId,
        },
      },
    });

    this.logger.log(`Favorite removed: contract=${contractId}`);
  }

  /**
   * Get all favorites for a user
   */
  async findAll(userId: string): Promise<FavoriteResponseDto[]> {
    this.logger.log(`Getting favorites for user: ${userId}`);

    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        contract: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((favorite) => ({
      id: favorite.id,
      userId: favorite.userId,
      contractId: favorite.contractId,
      createdAt: favorite.createdAt,
      contract: favorite.contract,
    }));
  }

  /**
   * Check if a contract is favorited by a user
   */
  async isFavorited(
    contractId: string,
    userId: string,
  ): Promise<FavoriteCheckResponseDto> {
    this.logger.debug(
      `Checking favorite status: user=${userId}, contract=${contractId}`,
    );

    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_contractId: {
          userId,
          contractId,
        },
      },
    });

    return {
      isFavorited: !!favorite,
      favoriteId: favorite?.id,
    };
  }

  /**
   * Get count of favorites for a user
   */
  async count(userId: string): Promise<number> {
    return this.prisma.favorite.count({
      where: { userId },
    });
  }

  /**
   * Toggle favorite status
   */
  async toggle(
    contractId: string,
    userId: string,
  ): Promise<{ isFavorited: boolean; favorite?: FavoriteResponseDto }> {
    const status = await this.isFavorited(contractId, userId);

    if (status.isFavorited) {
      await this.remove(contractId, userId);
      return { isFavorited: false };
    } else {
      const favorite = await this.create(contractId, userId);
      return { isFavorited: true, favorite };
    }
  }
}
