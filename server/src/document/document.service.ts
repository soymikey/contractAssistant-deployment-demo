import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { DocxService } from './docx.service';
import {
  DocumentMetadata,
  ProcessedDocument,
} from './interfaces/document.interface';

export type FileType = 'pdf' | 'docx' | 'doc' | 'image' | 'unknown';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private readonly pdfService: PdfService,
    private readonly docxService: DocxService,
  ) {}

  /**
   * Process document file and extract content
   * This is the main entry point for document processing
   * @param file Multer file object
   * @returns Processed document ready for AI analysis
   */
  async processDocument(file: Express.Multer.File): Promise<ProcessedDocument> {
    try {
      this.logger.log(
        `Processing document: ${file.originalname} (${file.mimetype})`,
      );

      const fileType = this.detectFileType(file);
      this.logger.log(`Detected file type: ${fileType}`);

      switch (fileType) {
        case 'pdf':
          return await this.processPdf(file);

        case 'docx':
        case 'doc':
          return await this.processDocx(file);

        case 'image':
          return this.processImage(file);

        default:
          throw new BadRequestException(
            `Unsupported file type: ${file.mimetype}`,
          );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process document: ${errorMessage}`);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        `Failed to process document: ${errorMessage}`,
      );
    }
  }

  /**
   * Process PDF file
   * PDFs are sent directly to Gemini multimodal API (no text extraction needed)
   * Gemini can handle both text-based and image-based PDFs natively
   * @param file Multer file object
   * @returns Processed document
   */
  private async processPdf(
    file: Express.Multer.File,
  ): Promise<ProcessedDocument> {
    try {
      this.logger.log(
        'Processing PDF file - will send directly to Gemini API...',
      );

      // Extract only metadata for logging/tracking purposes
      const pdfMetadata = await this.pdfService.extractMetadata(file.buffer);

      const metadata: DocumentMetadata = {
        title: pdfMetadata.title,
        author: pdfMetadata.author,
        subject: pdfMetadata.subject,
        creator: pdfMetadata.creator,
        createdAt: pdfMetadata.creationDate,
        modifiedAt: pdfMetadata.modificationDate,
        pageCount: pdfMetadata.pageCount,
        fileType: 'pdf',
      };

      // Convert to base64 for Gemini API
      const base64 = file.buffer.toString('base64');

      this.logger.log(
        `PDF processed: ${pdfMetadata.pageCount} pages, ready for Gemini`,
      );

      // Return as image type - Gemini will handle it as multimodal
      return {
        type: 'image', // Gemini treats PDF like images
        buffer: file.buffer,
        base64,
        mimeType: 'application/pdf',
        metadata,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process PDF: ${errorMessage}`);
      throw new BadRequestException(`Failed to process PDF: ${errorMessage}`);
    }
  }

  /**
   * Process DOCX/DOC file
   * @param file Multer file object
   * @returns Processed document
   */
  private async processDocx(
    file: Express.Multer.File,
  ): Promise<ProcessedDocument> {
    try {
      this.logger.log('Processing DOCX file...');

      // Extract text and metadata
      const { text, metadata: docxMetadata } =
        await this.docxService.extractAll(file.buffer);

      const metadata: DocumentMetadata = {
        title: docxMetadata.title,
        author: docxMetadata.author,
        wordCount: docxMetadata.wordCount,
        fileType: 'docx',
      };

      this.logger.log('DOCX processed successfully');
      return {
        type: 'text',
        text,
        metadata,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process DOCX: ${errorMessage}`);
      throw new BadRequestException(`Failed to process DOCX: ${errorMessage}`);
    }
  }

  /**
   * Process image file
   * Images are sent directly to multimodal AI (no OCR needed)
   * @param file Multer file object
   * @returns Processed document
   */
  private processImage(file: Express.Multer.File): ProcessedDocument {
    this.logger.log('Processing image file...');

    const metadata: DocumentMetadata = {
      fileType: 'image',
    };

    const base64 = file.buffer.toString('base64');

    this.logger.log('Image processed successfully');
    return {
      type: 'image',
      buffer: file.buffer,
      base64,
      mimeType: file.mimetype,
      metadata,
    };
  }

  /**
   * Detect file type from mimetype and filename
   * @param file Multer file object
   * @returns Detected file type
   */
  detectFileType(file: Express.Multer.File): FileType {
    const { mimetype, originalname } = file;

    // Check by MIME type first
    if (mimetype === 'application/pdf') {
      return 'pdf';
    }

    if (
      mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      return mimetype === 'application/msword' ? 'doc' : 'docx';
    }

    if (
      mimetype === 'image/jpeg' ||
      mimetype === 'image/jpg' ||
      mimetype === 'image/png' ||
      mimetype === 'image/webp'
    ) {
      return 'image';
    }

    // Check by file extension as fallback
    const ext = originalname.toLowerCase().split('.').pop();

    if (ext === 'pdf') {
      return 'pdf';
    }

    if (ext === 'docx') {
      return 'docx';
    }

    if (ext === 'doc') {
      return 'doc';
    }

    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp') {
      return 'image';
    }

    return 'unknown';
  }

  /**
   * Get supported file types
   * @returns Array of supported MIME types
   */
  getSupportedFileTypes(): string[] {
    return [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
  }

  /**
   * Check if file type is supported
   * @param mimetype File MIME type
   * @returns true if supported
   */
  isSupportedFileType(mimetype: string): boolean {
    return this.getSupportedFileTypes().includes(mimetype);
  }
}
