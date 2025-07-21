/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  login = async (dto: LoginDto) => {
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
