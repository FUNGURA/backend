import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { IsString } from 'class-validator';
import { MenuItem } from './menuItem.entity';
import { Manager } from './manager.entity';
import { Inventory } from './inventory.entity';
import { Table as RestaurantTable } from './table.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';
import { Location } from 'src/dtos';
@Entity('restaurants')
export class Restaurant extends MetaData {
  @Column({ type: 'varchar', length: 255 })
  @IsString()
  name: string;
  @Column({ type: 'jsonb' })
  @IsString()
  location: Location;
  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ type: 'varchar', nullable: true })
  openTime: string;

  @Column({ type: 'varchar', nullable: true })
  closeTime: string;
  @OneToOne(() => Manager, (manager) => manager.restaurant)
  @JoinColumn()
  manager: Manager;
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
