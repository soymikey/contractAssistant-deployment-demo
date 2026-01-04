import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ContractResponseDto {
  @ApiProperty({
    description: 'Contract ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User ID who owns this contract',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'File name',
    example: 'employment_contract.pdf',
  })
  @Expose()
  fileName: string;

  @ApiProperty({
    description: 'File URL',
    example: 'https://storage.example.com/contracts/abc123.pdf',
  })
  @Expose()
  fileUrl: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  @Expose()
  fileType: string;

  @ApiPropertyOptional({
    description: 'File size in bytes',
    example: 1048576,
  })
  @Expose()
  fileSize?: number;

  @ApiProperty({
    description: 'Processing status',
    example: 'completed',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-01-05T10:30:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-01-05T11:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<ContractResponseDto>) {
    Object.assign(this, partial);
  }
}
