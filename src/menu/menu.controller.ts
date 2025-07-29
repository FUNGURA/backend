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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { GetUser, Roles } from 'src/decorators';
import { URole } from 'src/enum';
import { User } from 'src/entities';
import { JwtAuthGuard, ManagerGuard } from 'src/guards';
import { DefinedApiResponse } from 'src/payload/defined.payload';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles(URole.MANAGER)
  @UseGuards(JwtAuthGuard, ManagerGuard)
  async create(@GetUser() user: User, @Body() createMenuDto: CreateMenuDto) {
    return new DefinedApiResponse(
      true,
      null,
      await this.menuService.create(user, createMenuDto),
    );
  }

  @Get('/restaurant/:restaurantId')
  findAll(@Param('restaurantId') restaurantId: string) {
    return this.menuService.findAllByRestaurant(restaurantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @Roles(URole.MANAGER)
  @UseGuards(JwtAuthGuard, ManagerGuard)
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(id, updateMenuDto, user);
  }

  @Delete(':id')
  @Roles(URole.MANAGER)
  @UseGuards(JwtAuthGuard, ManagerGuard)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.menuService.remove(id, user);
  }
}
