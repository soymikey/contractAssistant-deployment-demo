import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateContractDto,
  UpdateContractDto,
  ContractFilterDto,
  ContractResponseDto,
  PaginatedContractResponseDto,
} from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new contract
   */
  async create(
    createContractDto: CreateContractDto,
    userId: string,
  ): Promise<ContractResponseDto> {
    this.logger.log(`Creating contract for user ${userId}`);

    const contract = await this.prisma.contract.create({
      data: {
        ...createContractDto,
        userId,
      },
    });

    return plainToInstance(ContractResponseDto, contract, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Find all contracts for a user with filtering, sorting, and pagination
   */
  async findAll(
    filterDto: ContractFilterDto,
    userId: string,
  ): Promise<PaginatedContractResponseDto> {
    const {
      status,
      fileType,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    // Build where clause

    const where: any = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    if (fileType) {
      where.fileType = fileType;
    }

    if (search) {
      where.fileName = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries in parallel

    const [contracts, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.contract.count({ where }),
    ]);

    this.logger.log(
      `Found ${contracts.length} contracts for user ${userId} (total: ${total})`,
    );

    const contractDtos = contracts.map((contract) =>
      plainToInstance(ContractResponseDto, contract, {
        excludeExtraneousValues: true,
      }),
    );

    return new PaginatedContractResponseDto(contractDtos, total, page, limit);
  }

  /**
   * Find a single contract by ID
   */
  async findOne(id: string, userId: string): Promise<ContractResponseDto> {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    // Check ownership
    if (contract.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this contract',
      );
    }

    return plainToInstance(ContractResponseDto, contract, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Update a contract
   */
  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    userId: string,
  ): Promise<ContractResponseDto> {
    // Verify ownership
    await this.findOne(id, userId);

    this.logger.log(`Updating contract ${id}`);

    const contract = await this.prisma.contract.update({
      where: { id },
      data: updateContractDto,
    });

    return plainToInstance(ContractResponseDto, contract, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Delete a contract (soft delete by updating status or hard delete)
   */
  async remove(id: string, userId: string): Promise<void> {
    // Verify ownership
    await this.findOne(id, userId);

    this.logger.log(`Deleting contract ${id}`);

    // Hard delete (cascades to analyses, risks, favorites, logs via Prisma schema)
    await this.prisma.contract.delete({
      where: { id },
    });

    this.logger.log(`Contract ${id} deleted successfully`);
  }

  /**
   * Update contract status (used internally by upload/analysis services)
   */
  async updateStatus(id: string, status: string): Promise<void> {
    await this.prisma.contract.update({
      where: { id },
      data: { status },
    });

    this.logger.log(`Contract ${id} status updated to ${status}`);
  }

  /**
   * Get contract statistics for a user
   */
  async getStats(userId: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byFileType: Record<string, number>;
  }> {
    const [total, byStatus, byFileType] = await Promise.all([
      // Total count
      this.prisma.contract.count({
        where: { userId },
      }),

      // Count by status
      this.prisma.contract.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
      }),

      // Count by file type
      this.prisma.contract.groupBy({
        by: ['fileType'],
        where: { userId },
        _count: { fileType: true },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byFileType: byFileType.reduce(
        (acc, item) => {
          acc[item.fileType] = item._count.fileType;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  /**
   * Check if a contract exists and belongs to a user
   */
  async existsAndBelongsToUser(id: string, userId: string): Promise<boolean> {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      select: { userId: true },
    });

    return contract !== null && contract.userId === userId;
  }
}
