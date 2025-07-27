/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto';
import { Client, User } from 'src/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { RegisterClientDto } from './dto';
import { URole } from 'src/enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) { }

  async register(dto: RegisterClientDto) {
    try {
      const existingUser: User = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existingUser)
        throw new ConflictException('Email already exists!');

      const hashedPassword = await hash(dto.password, 10);

      const user = this.userRepo.create({
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        password: hashedPassword,
        gender: dto.gender,
        phoneNumber: dto.phoneNumber,
        dateOfBirth: dto.dateOfBirth,
        role: URole.CLIENT,
      });

      const savedUser = await this.userRepo.save(user);
      const client = this.clientRepo.create({
        user_id: savedUser.uuid,
      })
      const savedClient = await this.clientRepo.save(client);

      const payload = {
        email: savedUser.email,
        role: savedUser.role,
        phoneNumber: savedUser.phoneNumber,
      }

      const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

      const { password, ...safeUser } = savedUser;
      return {
        message: 'User registered successfully',
        token,
        user: safeUser,
        client: savedClient,
        status: 201,
      };

    } catch (e: any) {
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(e.message);

    }
  }

  async login(dto: LoginDto) {
    try {
      if (!dto.email || !dto.password)
        throw new BadRequestException('Login details must be provided!');
      const u: User = await this.userRepo.findOne({
        where: {
          email: dto.email,
        },
      });

      if (!u) throw new BadRequestException('Invalid email or password!');
      const isPasswordValid = await compare(dto.password, u.password);
      if (!isPasswordValid)
        throw new BadRequestException('Invalid email or password!');
      const payload = {
        email: u.email,
        role: u.role,
        phoneNumber: u.phoneNumber,
      };
      const token: string = sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      console.log('====================================');
      console.log(token);
      console.log('====================================');
      return {
        data: token,
        role: u.role,
        status: 200,
      };
    } catch (e: any) {
      if (e instanceof HttpException) {
        throw e; // Re-throw original HttpException with its status
      }
      throw new InternalServerErrorException(e.message);
    }
  };
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
