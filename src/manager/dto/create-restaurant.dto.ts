import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Name of the restaurant',
    example: 'Fungura Dine',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Location/address of the restaurant',
    example: 'Kigali, Rwanda',
  })
  @IsString()
  @IsNotEmpty()
  location: string;
}
