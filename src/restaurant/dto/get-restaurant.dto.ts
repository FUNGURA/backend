import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetRestaurantDto {
  @ApiPropertyOptional({ description: 'Filter by name (optional)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by location (optional)' })
  @IsOptional()
  @IsString()
  location?: string;
}
