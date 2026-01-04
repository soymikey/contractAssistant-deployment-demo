import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as crypto from 'crypto';

// Allowed MIME types for contract files
const ALLOWED_MIME_TYPES = [
  'application/pdf', // PDF files
  'image/jpeg', // JPEG images
  'image/jpg', // JPG images
  'image/png', // PNG images
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/msword', // DOC
];

// File size limit: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

// Upload directory
const UPLOAD_DIR = join(process.cwd(), 'uploads', 'contracts');

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * File filter function to validate file types
 */
export const fileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestException(
        `Invalid file type. Allowed types: PDF, JPEG, JPG, PNG, DOC, DOCX`,
      ),
      false,
    );
  }
};

/**
 * Generate unique filename
 */
const filename = (req: any, file: Express.Multer.File, callback: any) => {
  const uniqueSuffix = crypto.randomBytes(16).toString('hex');
  const ext = extname(file.originalname);
  const name = `${Date.now()}-${uniqueSuffix}${ext}`;
  callback(null, name);
};

/**
 * Multer configuration for file uploads
 */
export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: UPLOAD_DIR,
    filename,
  }),
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
};

/**
 * Multer configuration for temporary uploads
 */
export const multerTempConfig: MulterOptions = {
  storage: diskStorage({
    destination: join(process.cwd(), 'uploads', 'temp'),
    filename,
  }),
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
};
