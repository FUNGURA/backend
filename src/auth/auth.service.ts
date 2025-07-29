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
import * as otpGen from 'otp-generator';
import { sign } from 'jsonwebtoken';
import { RegisterClientDto } from './dto';
import { URole } from 'src/enum';
import { OTP } from 'src/entities/otp.entity';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,

    @InjectRepository(OTP)
    private readonly otpRepo: Repository<OTP>,

    private readonly emailService: EmailService,
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

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User with this email does not exist');

    const otp = otpGen.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    await this.emailService.sendResetEmail(email, user, otp);

    // Delete previous OTPs for this user
    await this.otpRepo.delete({ user: { uuid: user.uuid } });

    // Create new OTP record linked to user
    const otpEntity = this.otpRepo.create({
      otp,
      user,
    });
    await this.otpRepo.save(otpEntity);

    return { message: 'Reset password OTP sent to your email' };
  }


  async verifyOtp(email: string, otp: string) {
    const otpEntry = await this.otpRepo.findOne({
      where: {
        otp,
        user: { email },
      },
      relations: ['user'],
    });

    if (!otpEntry) throw new BadRequestException('Invalid OTP');

    const expirationTime = new Date(otpEntry.createdAt.getTime() + 5 * 60_000);
    if (new Date() > expirationTime) throw new BadRequestException('OTP expired');

    await this.otpRepo.delete({ id: otpEntry.id });

    const user = otpEntry.user;
    if (!user) throw new BadRequestException('User not found');

    const payload = {
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      userId: user.uuid,
    };
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { message: 'OTP verified', token, userId: user.uuid };
  }


  async resetPassword(userId: string, dto: ResetPasswordDto) {
    if (dto.password !== dto.confirmPassword)
      throw new BadRequestException('Passwords do not match');

    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new BadRequestException('Invalid user');

    const isSamePassword = await compare(user.password, dto.password);
    if (isSamePassword) throw new BadRequestException('That is your current password, please choose another password');

    const hashedPassword = await hash(dto.password, 10);
    user.password = hashedPassword;
    await this.userRepo.save(user);

    return { message: 'Password reset successfully. Please login again.' };
  }


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
