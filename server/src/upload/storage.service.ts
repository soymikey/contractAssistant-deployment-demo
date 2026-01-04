import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';
import { getErrorMessage } from '../common/utils/error.util';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = join(process.cwd(), 'uploads', 'contracts');
  }

  /**
   * Save file to local storage
   * @param file - Multer file object
   * @returns File URL
   */
  async saveToLocal(file: Express.Multer.File): Promise<string> {
    try {
      const fileUrl = `/uploads/contracts/${file.filename}`;
      this.logger.log(`File saved to local storage: ${fileUrl}`);
      return fileUrl;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to save file');
      this.logger.error(
        `Failed to save file to local storage: ${errorMessage}`,
      );
      throw new InternalServerErrorException('Failed to save file');
    }
  }

  /**
   * Delete file from local storage
   * @param fileUrl - File URL to delete
   */
  async deleteFromLocal(fileUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const filename = fileUrl.split('/').pop();
      if (!filename) {
        throw new Error('Invalid file URL');
      }

      const filePath = join(this.uploadDir, filename);

      // Check if file exists
      if (!existsSync(filePath)) {
        throw new NotFoundException('File not found');
      }

      // Delete file
      await fs.unlink(filePath);
      this.logger.log(`File deleted from local storage: ${fileUrl}`);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to delete file');
      this.logger.error(
        `Failed to delete file from local storage: ${errorMessage}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  /**
   * Check if file exists in local storage
   * @param fileUrl - File URL to check
   * @returns True if file exists
   */
  async fileExists(fileUrl: string): Promise<boolean> {
    try {
      const filename = fileUrl.split('/').pop();
      if (!filename) {
        return false;
      }

      const filePath = join(this.uploadDir, filename);
      return existsSync(filePath);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        'Failed to check file existence',
      );
      this.logger.error(`Failed to check file existence: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Get file size
   * @param fileUrl - File URL
   * @returns File size in bytes
   */
  async getFileSize(fileUrl: string): Promise<number> {
    try {
      const filename = fileUrl.split('/').pop();
      if (!filename) {
        throw new Error('Invalid file URL');
      }

      const filePath = join(this.uploadDir, filename);
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to get file size');
      this.logger.error(`Failed to get file size: ${errorMessage}`);
      throw new NotFoundException('File not found');
    }
  }

  /**
   * Get absolute file path
   * @param fileUrl - File URL
   * @returns Absolute file path
   */
  getAbsoluteFilePath(fileUrl: string): string {
    const filename = fileUrl.split('/').pop();
    if (!filename) {
      throw new Error('Invalid file URL');
    }
    return join(this.uploadDir, filename);
  }

  /**
   * TODO: Upload to S3 (for future implementation)
   * @param _file - Multer file object
   * @returns S3 file URL
   */
  async uploadToS3(_file: Express.Multer.File): Promise<string> {
    // TODO: Implement S3 upload when needed
    // This would require:
    // 1. Install aws-sdk: pnpm add aws-sdk
    // 2. Configure AWS credentials
    // 3. Upload file to S3 bucket
    // 4. Return S3 URL
    throw new Error('S3 upload not implemented yet');
  }

  /**
   * TODO: Delete from S3 (for future implementation)
   * @param _fileUrl - S3 file URL
   */
  async deleteFromS3(_fileUrl: string): Promise<void> {
    // TODO: Implement S3 deletion when needed
    throw new Error('S3 deletion not implemented yet');
  }

  /**
   * TODO: Get signed URL for S3 file (for future implementation)
   * @param _fileKey - S3 file key
   * @param _expiresIn - URL expiration time in seconds
   * @returns Signed URL
   */
  async getSignedUrl(
    _fileKey: string,
    _expiresIn: number = 3600,
  ): Promise<string> {
    // TODO: Implement S3 signed URL generation
    throw new Error('S3 signed URL not implemented yet');
  }
}
