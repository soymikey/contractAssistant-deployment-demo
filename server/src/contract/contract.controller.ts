import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ContractService } from './contract.service';
import {
  CreateContractDto,
  UpdateContractDto,
  ContractFilterDto,
  ContractResponseDto,
  PaginatedContractResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/types/authenticated-request.interface';

@ApiTags('Contracts')
@Controller('contracts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new contract',
    description:
      'Create a new contract record. This is typically called after file upload.',
  })
  @ApiResponse({
    status: 201,
    description: 'Contract created successfully',
    type: ContractResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async create(
    @Body() createContractDto: CreateContractDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ContractResponseDto> {
    return this.contractService.create(createContractDto, user.userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all contracts for the current user',
    description:
      'Retrieve a paginated list of contracts with optional filtering and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'Contracts retrieved successfully',
    type: PaginatedContractResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async findAll(
    @Query() filterDto: ContractFilterDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaginatedContractResponseDto> {
    return this.contractService.findAll(filterDto, user.userId);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get contract statistics',
    description:
      'Get statistics about contracts including total count, count by status, and count by file type',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 25 },
        byStatus: {
          type: 'object',
          example: { pending: 5, processing: 3, completed: 15, failed: 2 },
        },
        byFileType: {
          type: 'object',
          example: { 'application/pdf': 20, 'image/jpeg': 5 },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getStats(@CurrentUser() user: RequestUser) {
    return this.contractService.getStats(user.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a contract by ID',
    description: 'Retrieve detailed information about a specific contract',
  })
  @ApiParam({
    name: 'id',
    description: 'Contract UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Contract retrieved successfully',
    type: ContractResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Contract does not belong to current user',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<ContractResponseDto> {
    return this.contractService.findOne(id, user.userId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a contract',
    description: 'Update contract information (file name, status, etc.)',
  })
  @ApiParam({
    name: 'id',
    description: 'Contract UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Contract updated successfully',
    type: ContractResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Contract does not belong to current user',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ContractResponseDto> {
    return this.contractService.update(id, updateContractDto, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a contract',
    description:
      'Permanently delete a contract and all associated data (analyses, risks, favorites, logs)',
  })
  @ApiParam({
    name: 'id',
    description: 'Contract UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Contract deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Contract does not belong to current user',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    return this.contractService.remove(id, user.userId);
  }
}
