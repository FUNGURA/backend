import { PartialType } from '@nestjs/swagger';
import { CreatePrepStationDto } from './create-prep-station.dto';

export class UpdatePrepStationDto extends PartialType(CreatePrepStationDto) {}
