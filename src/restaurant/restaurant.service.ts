import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetRestaurantDto } from './dto/get-restaurant.dto';
import { MenuItem, Restaurant, Table } from 'src/entities';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurantRepo: Repository<Restaurant>,
        @InjectRepository(Table)
        private readonly tableRepo: Repository<Table>,
        @InjectRepository(MenuItem)
        private readonly menuRepo: Repository<MenuItem>
    ) { }

    async findAll(filters: GetRestaurantDto): Promise<Restaurant[]> {
        const query = this.restaurantRepo.createQueryBuilder('restaurant');

        if (filters.name) {
            query.andWhere('restaurant.name ILIKE :name', { name: `%${filters.name}%` });
        }

        if (filters.location) {
            query.andWhere('restaurant.location::text ILIKE :location', {
                location: `%${filters.location}%`,
            });
        }

        return query.getMany();
    }

    async findOne(uuid: string): Promise<Restaurant> {
        return this.restaurantRepo.findOne({
            where: { uuid },
            relations: ['menu', 'reviews'],
        });
    }

    async scanTable(tableId: string) {
        const table = await this.tableRepo.findOne({
            where: { uuid: tableId },
            relations: ['restaurant'],
        });

        if (!table) throw new NotFoundException('Table not found');

        const menu = await this.menuRepo.find({
            where: { restaurant: { uuid: table.restaurant.uuid } },
        });

        return {
            table: {
                uuid: table.uuid,
                tableNumber: table.tableNumber,
                capacity: table.capacity,
                isAvailable: table.isAvailable,
            },
            restaurant: {
                uuid: table.restaurant.uuid,
                name: table.restaurant.name,
                location: table.restaurant.location,
                image: table.restaurant.image,
                openTime: table.restaurant.openTime,
                closeTime: table.restaurant.closeTime,
            },
            menu,
        };
    }
}
