import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { Location } from 'src/dtos';

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
  @IsObject()
  @IsNotEmpty()
  location: Location;
}
