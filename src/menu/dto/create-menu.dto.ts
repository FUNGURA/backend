import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  Length,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Grilled Chicken Salad',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the menu item',
    example:
      'A healthy mix of grilled chicken, lettuce, tomatoes, and house dressing.',
  })
  @IsString()
  @Length(1, 500)
  description: string;

  @ApiProperty({
    description: 'Price of the menu item in the local currency',
    example: 12.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Time in minutes needed to prepare the dish',
    example: 15,
  })
  @IsNumber()
  @Min(1)
  preparationTime: number;

  @ApiProperty({
    description: 'Indicates whether the item is currently available',
    example: true,
  })
  @IsBoolean()
  available: boolean;

  @ApiProperty({
    description: 'UUID of the restaurant this menu item belongs to',
    example: 'a1f5b6f4-8de2-4cb0-a2cb-5e5b62cc556b',
  })
  @IsUUID()
  restaurantId: string;
}
