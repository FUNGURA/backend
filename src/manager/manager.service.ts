import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { CreateRestaurantDto, UpdateRestaurantDTO } from './dto';
import { Manager, Restaurant, User } from 'src/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { URole } from 'src/enum';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(Manager)
    private readonly managerRepo: Repository<Manager>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }
  async createRestaurant(
    user: User,
    dto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    try {
      const existing = await this.restaurantRepo.findOne({
        where: {
          name: dto.name.trim(),
        },
      });

      if (existing) {
        throw new ConflictException(
          `Restaurant '${dto.name}' at '${dto.location}' already exists.`,
        );
      }

      const manager = await this.managerRepo.findOne({
        where: {
          user_id: user.uuid,
        },
      });

      const newRestaurant = this.restaurantRepo.create({
        name: dto.name.trim(),
        location: dto.location,
        image: dto.image,
        openTime: dto.openTime,
        closeTime: dto.closeTime,
        manager,
      });
      return await this.restaurantRepo.save(newRestaurant);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateOwnProfile(userId: string, dto: UpdateManagerDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { uuid: userId },
      });

      if (!user || user.role !== URole.MANAGER) {
        throw new NotFoundException('Manager user not found');
      }

      // Check for duplicate email
      if (dto.email && dto.email !== user.email) {
        const existing = await this.userRepo.findOne({
          where: { email: dto.email },
        });
        if (existing) {
          throw new ConflictException('Email is already taken');
        }
        user.email = dto.email;
      }

      // Update other fields
      user.firstname = dto.firstname ?? user.firstname;
      user.lastname = dto.lastname ?? user.lastname;
      user.gender = dto.gender ?? user.gender;
      user.phoneNumber = dto.phoneNumber ?? user.phoneNumber;
      user.dateOfBirth = dto.dateOfBirth
        ? new Date(dto.dateOfBirth)
        : user.dateOfBirth;

      const updatedUser = await this.userRepo.save(user);

      return {
        message: 'Profile updated successfully',
        user: updatedUser,
      };
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateRestaurant(
    id: string,
    dto: UpdateRestaurantDTO,
  ): Promise<Restaurant> {
    return this.restaurantRepo
      .findOne({ where: { uuid: id } })
      .then((restaurant) => {
        if (!restaurant) {
          throw new NotFoundException(`Restaurant with id ${id} not found`);
        }
        restaurant.name = dto.name ?? restaurant.name;
        restaurant.location = dto.location ?? restaurant.location;
        restaurant.image = dto.image ?? restaurant.image;
        restaurant.openTime = dto.openTime ?? restaurant.openTime;
        restaurant.closeTime = dto.closeTime ?? restaurant.closeTime;
        
        return this.restaurantRepo.save(restaurant);
      });
  }

  async deleteRestaurant(id: string) {
    return this.restaurantRepo.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`Restaurant with id ${id} not found`);
      }
      return { message: 'Restaurant deleted successfully' };
    });
  }
}
