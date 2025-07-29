import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager, User } from 'src/entities';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { URole } from 'src/enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Manager)
    private readonly managerRepo: Repository<Manager>,
  ) {}
  async create(dto: CreateManagerDto) {
    try {
      // Check if email already exists
      const existingUser = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email is already taken');
      }

      // Hash password
      const hashedPassword = await hash(dto.password, 10);

      // Create User with MANAGER role
      const user =await  this.userRepo.create({
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        password: hashedPassword,
        gender: dto.gender,
        phoneNumber: dto.phoneNumber,
        dateOfBirth: dto.dateOfBirth,
        role: URole.MANAGER,
      });

      const savedUser = await this.userRepo.save(user);

      // Create Manager with user_id only (no restaurant yet)
      const manager = this.managerRepo.create({
        user_id: savedUser.uuid,
      });

      const savedManager = await this.managerRepo.save(manager);

      return {
        message: 'Manager created successfully',
        user: savedUser,
        manager: savedManager,
      };
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll() {
    try {
      return await this.userRepo.find({ where: { role: URole.MANAGER } });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { uuid: id, role: URole.MANAGER },
    });

    if (!user) {
      throw new NotFoundException(`MANAGER with id ${id} not found`);
    }

    return user;
  }



  async remove(id: string) {
    const user = await this.userRepo.findOne({
      where: { uuid: id, role: URole.MANAGER },
    });

    if (!user) {
      throw new NotFoundException(`MANAGER with id ${id} not found`);
    }

    try {
      await this.userRepo.remove(user);
      return { message: `MANAGER with id ${id} has been removed.` };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
