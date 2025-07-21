import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { Client } from './client.entity';
import { Restaurant } from './restaurant.entity';

@Entity('reviews')
export class Review extends MetaData {
  @OneToOne(() => Client, (client) => client.review, {
    onDelete: 'CASCADE',
  })
  client: Client;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Column({ type: 'int', width: 1 })
  rating: number;

  @Column({ type: 'text' })
  comment: string;
}
