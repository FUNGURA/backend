import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager, MenuItem, Restaurant, User } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Restaurant, User, Manager])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
