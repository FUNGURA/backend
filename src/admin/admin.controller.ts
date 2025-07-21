import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators';
import { AdminGuard, JwtAuthGuard } from 'src/guards';
import { Manager } from 'src/entities';
import { DefinedApiResponse } from 'src/payload/defined.payload';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @ApiOperation({ summary: 'Create a new manager (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Manager successfully created',
    type: DefinedApiResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Not admin)' })
  @ApiBody({ type: CreateManagerDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles('ADMIN')
  @Post('/create-manager')
  async createManager(@Body() dto: CreateManagerDto) {
    return new DefinedApiResponse(
      true,
      null,
      await this.adminService.create(dto),
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles('ADMIN')
  @Get('/all')
  @ApiOperation({ summary: 'List all managers (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all managers',
    type: DefinedApiResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Not admin)' })
  async findAll() {
    return new DefinedApiResponse(
      true,
      null,
      await this.adminService.findAll(),
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles('ADMIN')
  @Get('manager/:id')
  @ApiOperation({ summary: 'Get a manager by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Manager UUID' })
  @ApiResponse({
    status: 200,
    description: 'The manager with the given ID',
    type: DefinedApiResponse,
  })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Not admin)' })
  async findOne(@Param('id') id: string) {
    return new DefinedApiResponse(
      true,
      null,
      await this.adminService.findOne(id),
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles('ADMIN')
  @Delete('/delete/manager/:id')
  @ApiOperation({ summary: 'Delete a manager by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Manager UUID' })
  @ApiResponse({ status: 200, description: 'Manager successfully deleted' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Not admin)' })
  async remove(@Param('id') id: string) {
    return new DefinedApiResponse(
      true,
      null,
      await this.adminService.remove(id),
    );
  }
}
