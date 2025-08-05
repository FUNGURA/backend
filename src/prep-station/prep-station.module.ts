import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrepStation } from 'src/entities/prepStaion.entity';
import { PrepStationController } from './prep-station.controller';
import { PrepStationService } from './prep-station.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrepStation])],
  controllers: [PrepStationController],
  providers: [PrepStationService],
})
export class PrepStationModule {}
