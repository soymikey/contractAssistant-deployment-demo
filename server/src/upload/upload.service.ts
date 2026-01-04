import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueuesService } from '../queues/queues.service';
import { StorageService } from './storage.service';
import { UploadResponseDto } from './dto';
import { getErrorMessage } from '../common/utils/error.util';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly queuesService: QueuesService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Upload a single file
   * @param file - Multer file object
   * @param userId - User ID
   * @returns Upload response with contract details
   */
  async uploadFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadResponseDto> {
    try {
      // Save file to storage
      const fileUrl = await this.storageService.saveToLocal(file);

      // Create contract record in database
      const contract = await this.prisma.contract.create({
        data: {
          userId,
          fileName: file.originalname,
          fileUrl,
          fileType: file.mimetype,
          fileSize: file.size,
          status: 'pending',
        },
      });

      this.logger.log(`File uploaded successfully: ${contract.id}`);

      // Add upload processing job to queue
      await this.queuesService.addUploadJob(contract.id, userId, file.mimetype);

      // Return response
      return {
        id: contract.id,
        fileName: contract.fileName,
        fileUrl: contract.fileUrl,
        fileType: contract.fileType,
        fileSize: contract.fileSize,
        status: contract.status,
        createdAt: contract.createdAt,
      };
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to upload file');
      this.logger.error(`Failed to upload file: ${errorMessage}`);

      // If file was saved but database operation failed, clean up the file
      if (file) {
        try {
          const fileUrl = `/uploads/contracts/${file.filename}`;
          await this.storageService.deleteFromLocal(fileUrl);
        } catch (cleanupError: unknown) {
          const cleanupMessage = getErrorMessage(
            cleanupError,
            'Failed to cleanup file',
          );
          this.logger.error(
            `Failed to cleanup file after error: ${cleanupMessage}`,
          );
        }
      }

      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  /**
   * Upload multiple files
   * @param files - Array of Multer file objects
   * @param userId - User ID
   * @returns Array of upload responses
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    userId: string,
  ): Promise<UploadResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results: UploadResponseDto[] = [];
    const errors: string[] = [];

    // Process each file
    for (const file of files) {
      try {
        const result = await this.uploadFile(file, userId);
        results.push(result);
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error, 'Failed to upload file');
        this.logger.error(
          `Failed to upload file ${file.originalname}: ${errorMessage}`,
        );
        errors.push(`${file.originalname}: ${errorMessage}`);
      }
    }

    // If all uploads failed, throw error
    if (results.length === 0) {
      throw new InternalServerErrorException(
        `All uploads failed: ${errors.join(', ')}`,
      );
    }

    // If some uploads failed, log warning
    if (errors.length > 0) {
      this.logger.warn(
        `${errors.length} of ${files.length} uploads failed: ${errors.join(', ')}`,
      );
    }

    return results;
  }

  /**
   * Get contract by ID
   * @param id - Contract ID
   * @param userId - User ID
   * @returns Contract details
   */
  async getContract(id: string, userId: string): Promise<UploadResponseDto> {
    const contract = await this.prisma.contract.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    return {
      id: contract.id,
      fileName: contract.fileName,
      fileUrl: contract.fileUrl,
      fileType: contract.fileType,
      fileSize: contract.fileSize,
      status: contract.status,
      createdAt: contract.createdAt,
    };
  }

  /**
   * Get all contracts for a user
   * @param userId - User ID
   * @returns Array of contracts
   */
  async getUserContracts(userId: string): Promise<UploadResponseDto[]> {
    const contracts = await this.prisma.contract.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return contracts.map((contract) => ({
      id: contract.id,
      fileName: contract.fileName,
      fileUrl: contract.fileUrl,
      fileType: contract.fileType,
      fileSize: contract.fileSize,
      status: contract.status,
      createdAt: contract.createdAt,
    }));
  }

  /**
   * Delete contract by ID
   * @param id - Contract ID
   * @param userId - User ID
   */
  async deleteContract(id: string, userId: string): Promise<void> {
    // Find contract
    const contract = await this.prisma.contract.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    try {
      // Delete file from storage
      await this.storageService.deleteFromLocal(contract.fileUrl);

      // Delete contract from database (cascade delete will handle related records)
      await this.prisma.contract.delete({
        where: {
          id,
        },
      });

      this.logger.log(`Contract deleted successfully: ${id}`);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to delete contract');
      this.logger.error(`Failed to delete contract: ${errorMessage}`);
      throw new InternalServerErrorException('Failed to delete contract');
    }
  }

  /**
   * Update contract status
   * @param id - Contract ID
   * @param status - New status
   */
  async updateContractStatus(
    id: string,
    status: string,
  ): Promise<UploadResponseDto> {
    const contract = await this.prisma.contract.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return {
      id: contract.id,
      fileName: contract.fileName,
      fileUrl: contract.fileUrl,
      fileType: contract.fileType,
      fileSize: contract.fileSize,
      status: contract.status,
      createdAt: contract.createdAt,
    };
  }
}
