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
import { ManagerService } from './manager.service';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { DefinedApiResponse } from 'src/payload/defined.payload';
import { CreateRestaurantDto } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators';
import { JwtAuthGuard, ManagerGuard } from 'src/guards';

@ApiTags('manager')
@ApiBearerAuth()
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('/restaurants/create-restaurant')
  @Roles('MANAGER')
  @UseGuards(JwtAuthGuard, ManagerGuard)
  @ApiOperation({ summary: 'Create a new restaurant (MANAGER only)' })
  @ApiBody({ type: CreateRestaurantDto })
  @ApiResponse({
    status: 201,
    description: 'Restaurant created successfully',
    type: DefinedApiResponse,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict — e.g. duplicate restaurant name',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — not a manager or not authorized',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async createRestaurant(@Body() dto: CreateRestaurantDto) {
    return new DefinedApiResponse(
      true,
      null,
      await this.managerService.createRestaurant(dto),
    );
  }

  @Get()
  findAll() {
    return this.managerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managerService.update(+id, updateManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managerService.remove(+id);
  }
}
