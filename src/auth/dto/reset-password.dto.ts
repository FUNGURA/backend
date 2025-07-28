import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  confirmPassword: string;
}