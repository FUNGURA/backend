import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { Table } from './table.entity';
import { OrderStatus } from 'src/enum';
import { IsEnum } from 'class-validator';
import { Client } from './client.entity';
import { OrderItem } from './orderItem.entity';
import { Bill } from './Bill.entity';

@Entity('orders')
export class Order extends MetaData {
  @ManyToOne(() => Table, (table) => table.orders)
  table: Table;

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
  @OneToOne(() => Bill, (bill) => bill.order)
  bill: Bill;
}
