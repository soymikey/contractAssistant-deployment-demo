import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as mammoth from 'mammoth';

export interface DocxMetadata {
  title?: string;
  author?: string;
  subject?: string;
  wordCount: number;
  characterCount: number;
}

export interface DocxExtractionResult {
  text: string;
  html?: string;
  metadata: DocxMetadata;
  messages: string[]; // Warnings or info messages from extraction
}

@Injectable()
export class DocxService {
  private readonly logger = new Logger(DocxService.name);

  /**
   * Extract text from DOCX file
   * @param buffer DOCX file buffer
   * @returns Extracted text
   */
  async extractText(buffer: Buffer): Promise<string> {
    try {
      this.logger.log('Starting DOCX text extraction...');
      const result = await mammoth.extractRawText({ buffer });

      if (result.messages.length > 0) {
        this.logger.warn(
          `DOCX extraction warnings: ${JSON.stringify(result.messages)}`,
        );
      }

      this.logger.log(`Extracted ${result.value.length} characters from DOCX`);
      return result.value;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to extract text from DOCX: ${errorMessage}`);
      throw new BadRequestException(
        `Failed to extract text from DOCX: ${errorMessage}`,
      );
    }
  }

  /**
   * Extract text and HTML from DOCX file
   * HTML preserves some formatting information
   * @param buffer DOCX file buffer
   * @returns Extracted text and HTML
   */
  async extractTextAndHtml(
    buffer: Buffer,
  ): Promise<{ text: string; html: string; messages: string[] }> {
    try {
      this.logger.log('Starting DOCX text and HTML extraction...');

      // Extract raw text
      const textResult = await mammoth.extractRawText({ buffer });

      // Extract HTML
      const htmlResult = await mammoth.convertToHtml({ buffer });

      const messages = [
        ...textResult.messages.map((m) => m.message),
        ...htmlResult.messages.map((m) => m.message),
      ];

      if (messages.length > 0) {
        this.logger.warn(
          `DOCX extraction warnings: ${JSON.stringify(messages)}`,
        );
      }

      this.logger.log('DOCX text and HTML extraction completed');
      return {
        text: textResult.value,
        html: htmlResult.value,
        messages,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to extract text and HTML from DOCX: ${errorMessage}`,
      );
      throw new BadRequestException(
        `Failed to extract text and HTML from DOCX: ${errorMessage}`,
      );
    }
  }

  /**
   * Extract metadata from DOCX file
   * Note: mammoth doesn't extract metadata directly, so we calculate it from content
   * @param buffer DOCX file buffer
   * @returns DOCX metadata
   */
  async extractMetadata(buffer: Buffer): Promise<DocxMetadata> {
    try {
      this.logger.log('Starting DOCX metadata extraction...');
      const text = await this.extractText(buffer);

      const metadata: DocxMetadata = {
        wordCount: this.countWords(text),
        characterCount: text.length,
      };

      this.logger.log('DOCX metadata extracted successfully');
      return metadata;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to extract DOCX metadata: ${errorMessage}`);
      throw new BadRequestException(
        `Failed to extract DOCX metadata: ${errorMessage}`,
      );
    }
  }

  /**
   * Extract all data from DOCX file (text, HTML, metadata)
   * @param buffer DOCX file buffer
   * @returns Complete extraction result
   */
  async extractAll(buffer: Buffer): Promise<DocxExtractionResult> {
    try {
      this.logger.log('Starting full DOCX extraction...');
      const { text, html, messages } = await this.extractTextAndHtml(buffer);

      const metadata: DocxMetadata = {
        wordCount: this.countWords(text),
        characterCount: text.length,
      };

      this.logger.log('Full DOCX extraction completed successfully');
      return {
        text,
        html,
        metadata,
        messages,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to extract DOCX data: ${errorMessage}`);
      throw new BadRequestException(
        `Failed to extract DOCX data: ${errorMessage}`,
      );
    }
  }

  /**
   * Convert DOCX to base64 for storage or transmission
   * @param buffer DOCX file buffer
   * @returns Base64 encoded DOCX
   */
  convertToBase64(buffer: Buffer): string {
    this.logger.log('Converting DOCX to base64...');
    return buffer.toString('base64');
  }

  /**
   * Check if DOCX has text content
   * @param buffer DOCX file buffer
   * @returns true if DOCX has text
   */
  async hasText(buffer: Buffer): Promise<boolean> {
    try {
      const text = await this.extractText(buffer);
      const hasTextContent = text.trim().length > 50; // At least 50 characters
      this.logger.log(
        `DOCX text check: ${hasTextContent ? 'has text' : 'minimal text'}`,
      );
      return hasTextContent;
    } catch (_error) {
      this.logger.warn(
        'Could not determine if DOCX has text, assuming no text',
      );
      return false;
    }
  }

  /**
   * Count words in text
   * @param text Text to count words in
   * @returns Word count
   */
  private countWords(text: string): number {
    // Remove extra whitespace and split by whitespace
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length;
  }
}
