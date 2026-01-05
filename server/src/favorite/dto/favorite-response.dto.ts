import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContractSummaryDto {
  @ApiProperty({ description: 'Contract ID' })
  id: string;

  @ApiProperty({ description: 'Original file name' })
  fileName: string;

  @ApiProperty({ description: 'File type (pdf, docx, etc.)' })
  fileType: string;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  fileSize?: number | null;

  @ApiProperty({ description: 'Contract status' })
  status: string;

  @ApiProperty({ description: 'Contract creation date' })
  createdAt: Date;
}

export class FavoriteResponseDto {
  @ApiProperty({ description: 'Favorite ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Contract ID' })
  contractId: string;

  @ApiProperty({ description: 'Date when favorited' })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Contract details',
    type: ContractSummaryDto,
  })
  contract?: ContractSummaryDto;
}

export class FavoriteCheckResponseDto {
  @ApiProperty({ description: 'Whether the contract is favorited' })
  isFavorited: boolean;

  @ApiPropertyOptional({ description: 'Favorite ID if favorited' })
  favoriteId?: string;
}
