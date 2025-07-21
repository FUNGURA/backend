import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsDateString,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { UGender, URole } from 'src/enum';

export class CreateManagerDto {
  @ApiProperty({ example: 'Alice', description: 'First name of the manager' })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstname: string;

  @ApiProperty({ example: 'Johnson', description: 'Last name of the manager' })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastname: string;

  @ApiProperty({
    example: 'alice.manager@example.com',
    description: 'Email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Manager@123', description: 'Strong password' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: UGender,
    example: UGender.FEMALE,
    description: 'Gender of the manager',
  })
  @IsEnum(UGender)
  gender: UGender;

  @ApiProperty({
    example: '+250781234567',
    description: 'Phone number (international format)',
  })
  @IsOptional()
  @IsPhoneNumber('RW') // you can change 'RW' to appropriate ISO country code
  phoneNumber?: string;

  @ApiProperty({
    example: '1995-06-15',
    description: 'Date of birth (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    enum: URole,
    example: URole.MANAGER,
    description: 'Role of the user (always MANAGER)',
    readOnly: true,
  })
  readonly role: URole = URole.MANAGER;
}
