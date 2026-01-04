import { IsString, IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty({
    description: 'Name of the contract file',
    example: 'employment_contract.pdf',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'URL where the file is stored',
    example: 'https://storage.example.com/contracts/abc123.pdf',
  })
  @IsString()
  fileUrl: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
    enum: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
  })
  @IsString()
  fileType: string;

  @ApiPropertyOptional({
    description: 'Size of the file in bytes',
    example: 1048576,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  fileSize?: number;

  @ApiPropertyOptional({
    description: 'Processing status of the contract',
    example: 'pending',
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'processing', 'completed', 'failed'])
  status?: string;
}
