import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { v4 as uuidv4 } from 'uuid';
import { Order } from './order.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';

@Entity('clients')
export class Client extends MetaData {
  @Column()
  user_id: string = uuidv4();
  @OneToMany(() => Order, (order) => order.client)
  orders: Order[];
  @OneToMany(() => Reservation, (reservation) => reservation.client)
  reservations: Reservation[];
  @OneToOne(() => Review, (review) => review.client)
  review: Review;
}
