import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrepStation } from 'src/entities/prepStaion.entity';
import { CreatePrepStationDto } from './dto/create-prep-station.dto';
import { UpdatePrepStationDto } from './dto/update-prep-station.dto';
import { Restaurant } from 'src/entities';

@Injectable()
export class PrepStationService {
    constructor(
        @InjectRepository(PrepStation)
        private readonly prepStationRepo: Repository<PrepStation>,

        @InjectRepository(Restaurant)
        private readonly restaurantRepo: Repository<Restaurant>,
    ) { }

    async create(dto: CreatePrepStationDto) {
        const existing = await this.prepStationRepo.findOne({ where: { name: dto.name } });
        if (existing) {
            throw new ConflictException(`Prep station with name ${dto.name} already exists`);
        }

        const restaurant = await this.restaurantRepo.findOne({ where: { uuid: dto.restaurantId } });
        if (!restaurant) throw new NotFoundException('Restaurant not found');

        const prepStation = this.prepStationRepo.create({
            ...dto,
            restaurant,
        });

        return await this.prepStationRepo.save(prepStation);
    }

    async findAll() {
        return await this.prepStationRepo.find({
            relations: ['restaurant', 'menuItems']
        });
    }

    async update(id: string, dto: UpdatePrepStationDto) {
        const prepStation = await this.prepStationRepo.findOne({
            where: { uuid: id },
            relations: ['restaurant']
        });

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
