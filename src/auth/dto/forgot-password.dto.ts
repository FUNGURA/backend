import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({ description: 'Email for login', required: true })
  @IsString()
  @IsNotEmpty()
  email: string;
}
