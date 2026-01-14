import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UploadService } from './upload.service';
import { multerConfig } from './multer.config';
import { UploadResponseDto } from './dto';

/**
 * Controller for handling file uploads
 */
@Controller('upload')
@UseGuards(SupabaseAuthGuard)
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload a single file
   * POST /upload
   */
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('userId') userId: string,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.logger.log(
      `Upload request received from user ${userId}: ${file.originalname}`,
    );
    return this.uploadService.uploadFile(file, userId);
  }

  /**
   * Upload multiple files
   * POST /upload/multiple
   */
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser('userId') userId: string,
  ): Promise<UploadResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    this.logger.log(
      `Multiple upload request received from user ${userId}: ${files.length} files`,
    );
    return this.uploadService.uploadMultipleFiles(files, userId);
  }

  /**
   * Get contract by ID
   * GET /upload/:id
   */
  @Get(':id')
  async getContract(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<UploadResponseDto> {
    return this.uploadService.getContract(id, userId);
  }

  /**
   * Get all contracts for current user
   * GET /upload
   */
  @Get()
  async getUserContracts(
    @CurrentUser('userId') userId: string,
  ): Promise<UploadResponseDto[]> {
    return this.uploadService.getUserContracts(userId);
  }

  /**
   * Delete contract by ID
   * DELETE /upload/:id
   */
  @Delete(':id')
  async deleteContract(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<{ message: string }> {
    await this.uploadService.deleteContract(id, userId);
    return { message: 'Contract deleted successfully' };
  }
}
