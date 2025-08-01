import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class Location {
  @ApiProperty({ example: 'Kigali Heights, KG 7 Ave, Kigali', description: 'Readable place name or address' })
  @IsString()
  @IsNotEmpty()
  place_name: string;

  @ApiProperty({ example: '-1.9536', description: 'Latitude of location' })
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty({ example: '30.0912', description: 'Longitude of location' })
  @IsString()
  @IsNotEmpty()
  longitude: string;
}
