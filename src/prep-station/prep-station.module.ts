import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrepStation } from 'src/entities/prepStaion.entity';
import { PrepStationController } from './prep-station.controller';
import { PrepStationService } from './prep-station.service';
import { Restaurant } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PrepStation, Restaurant])],
  controllers: [PrepStationController],
  providers: [PrepStationService],
})
export class PrepStationModule {}
