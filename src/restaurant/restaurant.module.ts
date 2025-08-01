import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MenuItem, Restaurant, Table } from 'src/entities';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, Table, MenuItem])],
    controllers: [RestaurantController],
    providers: [RestaurantService],
})
export class RestaurantModule { }
