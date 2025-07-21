import { PartialType } from '@nestjs/swagger';
import { CreateManagerDto } from 'src/admin/dto/create-manager.dto';

export class UpdateManagerDto extends PartialType(CreateManagerDto) {}
