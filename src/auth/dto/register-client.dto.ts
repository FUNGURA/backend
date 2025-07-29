/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
  IsEmail,
} from 'class-validator';
import { UGender } from 'src/enum';

export class RegisterClientDto {
  @ApiProperty({ description: 'First name of the client', required: true })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'Last name of the client', required: true })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ description: 'Email address of the client', required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the account',
    minLength: 8,
    required: true,
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Gender of the client',
    enum: UGender,
    default: UGender.PREFER_NOT_TO_SAY,
    example: 'MALE',
  })
  @IsEnum(UGender)
  gender: UGender;

  @ApiProperty({ description: 'Phone number of the client', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Date of birth of the client',
    required: false,
    example: '1990-01-01',
  })
  @IsOptional()
  dateOfBirth?: Date;
}
