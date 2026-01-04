import { ApiProperty } from '@nestjs/swagger';
import { ContractResponseDto } from './contract-response.dto';

export class PaginatedContractResponseDto {
  @ApiProperty({
    description: 'List of contracts',
    type: [ContractResponseDto],
  })
  data: ContractResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  constructor(
    data: ContractResponseDto[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.data = data;
    this.meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
