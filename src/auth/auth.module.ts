import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client, Manager, User, Waiter } from 'src/entities';
import { OTP } from 'src/entities/otp.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    TypeOrmModule.forFeature([User, Manager, Client, Waiter, OTP]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
