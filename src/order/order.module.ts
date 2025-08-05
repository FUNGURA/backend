import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/orderItem.entity';
import { MenuItem } from 'src/entities/menuItem.entity';
import { Table } from 'src/entities/table.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, MenuItem, Table])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
