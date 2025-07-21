import { Column, Entity, ManyToOne } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { Table as RestaurantTable } from './table.entity';
import { Restaurant } from './restaurant.entity';
import { Client } from './client.entity';
import { ReservationStatus } from 'src/enum';
import { IsEnum } from 'class-validator';
@Entity('reservations')
export class Reservation extends MetaData {
  @ManyToOne(() => Client, (client) => client.reservations)
  client: Client;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reservations)
  restaurant: Restaurant;

  @ManyToOne(() => RestaurantTable, (table) => table.reservations, {
    nullable: true,
  })
  table: RestaurantTable;

  @Column({ type: 'timestamp' })
  reservedDate: Date;

  @Column()
  numberOfGuests: number;

  @Column({
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
