import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { CreateRestaurantDto } from './dto';
import { Restaurant } from 'src/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
  ) {}
  async createRestaurant(dto: CreateRestaurantDto): Promise<Restaurant> {
    try {
      const existing = await this.restaurantRepo.findOne({
        where: {
          name: dto.name.trim(),
          location: dto.location.trim(),
        },
      });

      if (existing) {
        throw new ConflictException(
          `Restaurant '${dto.name}' at '${dto.location}' already exists.`,
        );
      }

      const newRestaurant = this.restaurantRepo.create({
        name: dto.name.trim(),
        location: dto.location.trim(),
      });

      return await this.restaurantRepo.save(newRestaurant);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  findAll() {
    return `This action returns all manager`;
  }

  findOne(id: number) {
    return `This action returns a #${id} manager`;
  }

  update(id: number, updateManagerDto: UpdateManagerDto) {
    return `This action updates a #${id} manager`;
  }

  remove(id: number) {
    return `This action removes a #${id} manager`;
  }
}
