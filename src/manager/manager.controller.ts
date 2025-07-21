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
import { CreateRestaurantDto, UpdateRestaurantDTO } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, Roles } from 'src/decorators';
import { JwtAuthGuard, ManagerGuard } from 'src/guards';
import { User } from 'src/entities';

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

  @Patch('/update-profile')
  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Roles('MANAGER')
  @ApiOperation({ summary: 'Update own manager profile' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateManagerDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 409, description: 'Email already taken' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateProfile(@GetUser() user: User, @Body() dto: UpdateManagerDto) {
    return new DefinedApiResponse(
      true,
      null,
      await this.managerService.updateOwnProfile(user.uuid, dto),
    );
  }

  @Delete('/restaurant/delete/:id')
  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Roles('MANAGER')
  @ApiOperation({ summary: 'Delete a restaurant by ID (MANAGER only)' })
  @ApiParam({ name: 'id', type: String, description: 'Restaurant UUID' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant deleted successfully',
    type: DefinedApiResponse,
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @ApiResponse({ status: 403, description: 'Forbidden (Not manager)' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async removeRestaurant(@Param('id') id: string) {
    return new DefinedApiResponse(
      true,
      null,
      await this.managerService.deleteRestaurant(id),
    );
  }
  @Patch('/restaurant/update/:id')
  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Roles('MANAGER')
  @ApiOperation({ summary: 'Update a restaurant by ID (MANAGER only)' })
  @ApiParam({ name: 'id', type: String, description: 'Restaurant UUID' })
  @ApiBody({ type: CreateRestaurantDto })
  @ApiResponse({
    status: 200,
    description: 'Restaurant updated successfully',
    type: DefinedApiResponse,
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @ApiResponse({ status: 403, description: 'Forbidden (Not manager)' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateRestaurant(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDTO,
  ) {
    return new DefinedApiResponse(
      true,
      null,
      await this.managerService.updateRestaurant(id, dto),
    );
  }
}
