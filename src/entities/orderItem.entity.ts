import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { Waiter } from './waiter.entity';
import { MenuItem } from './menuItem.entity';
import { OrderItemStatus } from 'src/enum';
import { IsEnum } from 'class-validator';
import { Order } from './order.entity';
import { PrepStation } from './prepStaion.entity';
@Entity('order_items')
export class OrderItem extends MetaData {
  @OneToOne(() => Waiter, (waiter) => waiter.orderItem, { nullable: true })
  waiter: Waiter;
  @OneToOne(() => MenuItem)
  menuItem: MenuItem;
  @Column('int', { default: 1 })
  quantity: number;
  @Column({
    type: 'varchar',
    length: 50,
    enum: OrderItemStatus,
    default: OrderItemStatus.PENDING,
  })
  @IsEnum(OrderItemStatus)
  status: OrderItemStatus;
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
  @ManyToOne(() => PrepStation, (station) => station.orderItems, { nullable: true })
  prepStation: PrepStation;

}
