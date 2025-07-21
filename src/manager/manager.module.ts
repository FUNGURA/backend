import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { Manager, Restaurant, User } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant,User,Restaurant,Manager])],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
