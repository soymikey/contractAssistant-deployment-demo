export interface DocumentMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  pageCount?: number;
  wordCount?: number;
  fileType: 'pdf' | 'docx' | 'doc' | 'image';
}

export interface ProcessedDocument {
  /**
   * Processing type:
   * - 'text': Document with extracted text (DOCX) - send text to Gemini
   * - 'image': Document as image/PDF (PDF, Images) - send base64 to Gemini multimodal API
   */
  type: 'text' | 'image';
  text?: string; // Extracted text (only for DOCX)
  buffer?: Buffer; // Original file buffer (for PDF and images)
  base64?: string; // Base64 encoded file (for PDF and images)
  mimeType?: string; // MIME type (for PDF and images)
  metadata: DocumentMetadata; // File metadata
}
