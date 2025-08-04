import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePrepStationDto {
  @ApiProperty({ example: 'Kitchen' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Handles all cooked meals', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
