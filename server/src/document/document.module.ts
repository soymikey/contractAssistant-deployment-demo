import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { PdfService } from './pdf.service';
import { DocxService } from './docx.service';

@Module({
  providers: [DocumentService, PdfService, DocxService],
  exports: [DocumentService], // Export DocumentService for other modules
})
export class DocumentModule {}
