import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { Table as RestaurantTable } from './table.entity';
import { OrderStatus, OrderType } from 'src/enum';
import { IsEnum } from 'class-validator';
import { Client } from './client.entity';
import { OrderItem } from './orderItem.entity';
import { Bill } from './Bill.entity';

@Entity('orders')
export class Order extends MetaData {
  @ManyToOne(() => RestaurantTable, (table) => table.orders, { nullable: true })
  table?: RestaurantTable;

  @OneToOne(() => Client, (client) => client.orders)
  client: Client;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  items: OrderItem[];
  @Column({
    type: 'varchar',
    length: 50,
    enum: OrderStatus,
    default: OrderStatus.RECEIVED,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Column({ type: 'varchar', length: 20, enum: OrderType })
  @IsEnum(OrderType)
  orderType: OrderType;

  @Column({ type: 'varchar', nullable: true })
  deliveryAddress?: string;

  @Column({ type: 'varchar', nullable: true })
  contactPhone?: string;

  @OneToOne(() => Bill, (bill) => bill.order)
  bill: Bill;
}
