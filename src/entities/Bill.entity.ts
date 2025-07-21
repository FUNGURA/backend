import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { Order } from './order.entity';
import { paymentMethod } from 'src/enum';
import { IsEnum } from 'class-validator';

@Entity('bills')
export class Bill extends MetaData {
  @OneToOne(() => Order, (order) => order.bill, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tip: number;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'varchar', enum: paymentMethod, nullable: true })
  @IsEnum(paymentMethod)
  paymentMethod: paymentMethod;
}
