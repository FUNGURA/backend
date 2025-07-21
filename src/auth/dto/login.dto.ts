/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email for login', required: true })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password for login', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}
