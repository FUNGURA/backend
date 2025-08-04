import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Manager, MenuItem, PrepStation, Restaurant, User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(Manager)
    private readonly managerRepo: Repository<Manager>,
    @InjectRepository(MenuItem)
    private readonly menuRepo: Repository<MenuItem>,
    @InjectRepository(PrepStation)
    private readonly prepStationRepo: Repository<PrepStation>,
  ) { }

  async create(user: User, dto: CreateMenuDto) {
    try {
      const restaurant = await this.restaurantRepo.findOne({
        where: { uuid: dto.restaurantId },
        relations: ['manager'],
      });
      if (!restaurant)
        throw new NotFoundException('Restaurant not found with that id');

      const manager = await this.managerRepo.findOne({ where: { user_id: user.uuid } });
      const authorized = restaurant.manager.uuid === manager?.uuid;
      if (!authorized)
        throw new ForbiddenException('You are not authorized to create this menu item');

      const prepStation = await this.prepStationRepo.findOne({ where: { uuid: dto.prepStationId } });
      if (!prepStation) throw new NotFoundException('Prep station not found');

      return await this.menuRepo.save({
        name: dto.name,
        description: dto.description,
        price: dto.price,
        preparationTime: dto.preparationTime,
        available: dto.available,
        manager,
        restaurant,
        prepStation,
      });
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(e.message);
    }
  }


  findAllByRestaurant(restaurantId: string) {
    return this.menuRepo.find({
      where: {
        restaurant: {
          uuid: restaurantId,
        },
      },
    });
  }

  findOne(id: string) {
    try {
      return this.menuRepo.findOne({
        where: {
          uuid: id,
        },
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(id: string, dto: UpdateMenuDto, user: User) {
    const menu = await this.menuRepo.findOne({
      where: { uuid: id },
      relations: ['restaurant', 'restaurant.manager'],
    });
    if (!menu) throw new NotFoundException('Menu item not found');

    const manager = await this.managerRepo.findOne({ where: { user_id: user.uuid } });
    const authorized = menu.restaurant.manager.uuid === manager?.uuid;
    if (!authorized)
      throw new ForbiddenException('You are not authorized to update this menu item');

    if (dto.prepStationId) {
      const prepStation = await this.prepStationRepo.findOne({ where: { uuid: dto.prepStationId } });
      if (!prepStation) throw new NotFoundException('Prep station not found');
      menu.prepStation = prepStation;
    }

    Object.assign(menu, {
      ...(dto.name && { name: dto.name }),
      ...(dto.description && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.preparationTime !== undefined && { preparationTime: dto.preparationTime }),
      ...(dto.available !== undefined && { available: dto.available }),
    });

    try {
      await this.menuRepo.save(menu);
      return menu;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update menu item');
    }
  }


  async remove(id: string, user: User) {
    try {
      const manager = await this.managerRepo.findOne({
        where: {
          user_id: user.uuid,
        },
      });
      if (!manager) throw new BadRequestException(' manager not found ');
      const menu = await this.menuRepo.findOne({
        where: {
          uuid: id,
        },
        relations: ['manager', 'restaurant'],
      });
      if (!menu) throw new NotFoundException(' menu not found ');

      const authorized = menu.restaurant.manager.uuid === manager?.uuid;

      if (!authorized) {
        throw new ForbiddenException(
          'You are not authorized to update this menu item',
        );
      }
      await this.menuRepo.delete({
        uuid: id,
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException(e.message);
    }
  }
}
