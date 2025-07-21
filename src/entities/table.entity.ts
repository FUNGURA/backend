import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { Restaurant } from './restaurant.entity';
import { Order } from './order.entity';
import { Reservation } from './reservation.entity';
import { IsString } from 'class-validator';

@Entity('tables')
export class Table extends MetaData {
  @Column()
  @IsString()
  tableNumber: string; // e.g., "A1", "T5"

  @Column({ type: 'int' })
  capacity: number; // number of people

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];

  @OneToMany(() => Reservation, (reservation) => reservation.table)
  reservations: Reservation[];
}
