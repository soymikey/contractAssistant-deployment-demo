import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto, ChangePasswordDto } from './dto';
import { UserEntity } from './entities';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserEntity],
  })
  async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Cannot update other users',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('userId') currentUserId: string,
  ): Promise<UserEntity> {
    return this.userService.update(id, updateUserDto, currentUserId);
  }

  @Post(':id/change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Current password is incorrect',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Cannot change other users password',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser('userId') currentUserId: string,
  ): Promise<{ message: string }> {
    return this.userService.changePassword(
      id,
      changePasswordDto,
      currentUserId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Cannot delete other users',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser('userId') currentUserId: string,
  ): Promise<{ message: string }> {
    return this.userService.remove(id, currentUserId);
  }
}
