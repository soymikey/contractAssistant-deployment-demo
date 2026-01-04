import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Contract ID',
  })
  id: string;

  @ApiProperty({
    example: 'contract.pdf',
    description: 'Original filename',
  })
  fileName: string;

  @ApiProperty({
    example: '/uploads/contracts/1234567890-abc123.pdf',
    description: 'File URL',
  })
  fileUrl: string;

  @ApiProperty({
    example: 'application/pdf',
    description: 'File MIME type',
  })
  fileType: string;

  @ApiProperty({
    example: 1024000,
    description: 'File size in bytes',
    nullable: true,
  })
  fileSize: number | null;

  @ApiProperty({
    example: 'pending',
    description: 'Processing status',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  status: string;

  @ApiProperty({
    example: '2026-01-05T10:00:00.000Z',
    description: 'Upload timestamp',
  })
  createdAt: Date;
}
