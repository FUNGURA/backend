import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { Location } from 'src/dtos';

export class CreateRestaurantDto {
  @ApiProperty({ description: 'Name of the restaurant', example: 'Fungura Dine' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Location details', type: Location })
  @IsObject()
  @IsNotEmpty()
  location: Location;

  @ApiProperty({ description: 'Restaurant image URL', example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Opening time (24h format)', example: '08:00' })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiProperty({ description: 'Closing time (24h format)', example: '22:00' })
  @IsOptional()
  @IsString()
  closeTime?: string;
}
