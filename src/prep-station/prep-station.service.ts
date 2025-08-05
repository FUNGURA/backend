import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrepStation } from 'src/entities/prepStaion.entity';
import { CreatePrepStationDto } from './dto/create-prep-station.dto';
import { UpdatePrepStationDto } from './dto/update-prep-station.dto';

@Injectable()
export class PrepStationService {
    constructor(
        @InjectRepository(PrepStation)
        private readonly prepStationRepo: Repository<PrepStation>,
    ) { }

    async create(dto: CreatePrepStationDto) {
        const existing = await this.prepStationRepo.findOne({ where: { name: dto.name } });
        if (existing) {
            throw new ConflictException(`Prep station with name ${dto.name} already exists`);
        }

        const prepStation = this.prepStationRepo.create(dto);
        return await this.prepStationRepo.save(prepStation);
    }

    async findAll() {
        return await this.prepStationRepo.find({ relations: ['menuItems'] });
    }

    async update(id: string, dto: UpdatePrepStationDto) {
        const prepStation = await this.prepStationRepo.findOne({ where: { uuid: id } });
        if (!prepStation) throw new NotFoundException('Prep station not found');

        if (dto.name && dto.name !== prepStation.name) {
            const existing = await this.prepStationRepo.findOne({ where: { name: dto.name } });
            if (existing && existing.uuid !== id) {
                throw new ConflictException(`Prep station with name "${dto.name}" already exists`);
            }
        }

        Object.assign(prepStation, dto);
        return await this.prepStationRepo.save(prepStation);
    }

    async remove(id: string) {
        const prepStation = await this.prepStationRepo.findOne({ where: { uuid: id } });
        if (!prepStation) throw new NotFoundException('Prep station not found');

        await this.prepStationRepo.remove(prepStation);
        return { message: 'Prep station deleted successfully' };
    }
}
