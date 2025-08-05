import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager, MenuItem, PrepStation, Restaurant, User } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Restaurant, User, Manager, PrepStation])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
