import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { UGender } from 'src/enum';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'First name', example: 'John' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  firstname?: string;

  @ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  lastname?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+250788123456' })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-05-12' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Gender', enum: UGender, example: UGender.MALE })
  @IsOptional()
  @IsEnum(UGender)
  gender?: UGender;
}
