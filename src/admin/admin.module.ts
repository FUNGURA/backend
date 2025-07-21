import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager, User } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Manager, User]), // Assuming Manager and User are the entities used in AdminService
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
