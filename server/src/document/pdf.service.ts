import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

export interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pageCount: number;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  /**
   * Extract metadata from PDF file using pdf-parse v2 API
   * This is used for logging and tracking purposes only
   * The actual PDF content is sent directly to Gemini API
   * @param buffer PDF file buffer
   * @returns PDF metadata
   */
  async extractMetadata(buffer: Buffer): Promise<PdfMetadata> {
    let parser: PDFParse | null = null;
    try {
      this.logger.log('Extracting PDF metadata...');

      // Create parser instance with buffer data
      parser = new PDFParse({ data: buffer });

      // Extract metadata using getInfo() method
      // parsePageInfo: true to get page-level information if needed
      const result = await parser.getInfo({ parsePageInfo: false });

      const metadata: PdfMetadata = {
        pageCount: result.total,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        title: result.info?.Title,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        author: result.info?.Author,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        subject: result.info?.Subject,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        creator: result.info?.Creator,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        producer: result.info?.Producer,
      };

      // Parse dates using the built-in date parser
      const dates = result.getDateNode();
      if (dates.CreationDate) {
        metadata.creationDate = dates.CreationDate;
      }
      if (dates.ModDate) {
        metadata.modificationDate = dates.ModDate;
      }

      this.logger.log(
        `PDF metadata extracted: ${metadata.pageCount} pages, title: ${metadata.title || 'N/A'}`,
      );
      return metadata;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to extract PDF metadata: ${errorMessage}`);
      throw new BadRequestException(
        `Failed to extract PDF metadata: ${errorMessage}`,
      );
    } finally {
      // Always destroy the parser to free memory
      if (parser) {
        await parser.destroy();
      }
    }
  }
}
