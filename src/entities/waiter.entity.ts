import { Column, Entity, OneToMany } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from './orderItem.entity';
import { IsBoolean } from 'class-validator';

@Entity('waiters')
export class Waiter extends MetaData {
  @Column()
  user_id: string = uuidv4();

  @OneToMany(() => OrderItem, (order) => order.waiter)
  orderItem: OrderItem[];

  @Column({ default: true })
  @IsBoolean()
  available: boolean;
}
