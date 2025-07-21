import { Column, Entity, OneToMany } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { IsString } from 'class-validator';
import { MenuItem } from './menuItem.entity';
import { Manager } from './manager.entity';
import { Inventory } from './inventory.entity';
import { Table as RestaurantTable } from './table.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';

@Entity('restaurants')
export class Restaurant extends MetaData {
  @Column({ type: 'varchar', length: 255 })
  @IsString()
  name: string;
  @Column({ type: 'varchar', length: 255 })
  @IsString()
  location: string;
  @OneToMany(() => Manager, (manager) => manager.restaurant)
  managers: Manager[];
  @OneToMany(() => Inventory, (inventory) => inventory.restaurant)
  inventories: Inventory[];

  @OneToMany(() => MenuItem, (menu) => menu.restaurant)
  menu: MenuItem[];
  @OneToMany(() => RestaurantTable, (table) => table.restaurant)
  tables: RestaurantTable[];

  @OneToMany(() => Reservation, (reservation) => reservation.restaurant)
  reservations: Reservation[];
  @OneToMany(() => Review, (review) => review.client)
  reviews: Review[];
}
