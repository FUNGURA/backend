import { Column, Entity, ManyToOne } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { Restaurant } from './restaurant.entity';
import { Manager } from './manager.entity';
@Entity('inventories')
export class Inventory extends MetaData {
  @Column()
  name: string;

  @Column('int')
  quantity: number;

  @Column('int')
  threshold: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.inventories, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @ManyToOne(() => Manager, (manager) => manager.inventories, {
    onDelete: 'SET NULL',
  })
  manager: Manager;
}
