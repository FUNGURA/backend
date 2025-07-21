import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { Type } from 'class-transformer';
import { Restaurant } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
