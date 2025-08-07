import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { MenuItem } from './menuItem.entity';
import { OrderItem } from './orderItem.entity';
import { Restaurant } from './restaurant.entity';

@Entity('prep_stations')
export class PrepStation extends MetaData {
  @Column({ unique: true })
  name: string; // e.g., "Kitchen", "Bar"

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.prepStations, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.prepStation)
  menuItems: MenuItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.prepStation)
  orderItems: OrderItem[];
}
