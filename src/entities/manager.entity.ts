import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { Restaurant } from './restaurant.entity';
import { MenuItem } from './menuItem.entity';
import { Inventory } from './inventory.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('managers')
export class Manager extends MetaData {
  @Column()
  user_id: string = uuidv4();

  @OneToMany(() => Inventory, (inventory) => inventory.restaurant)
  inventories: Inventory[];

  @OneToMany(() => MenuItem, (item) => item.manager)
  menuItems: MenuItem[];

  @ManyToOne(() => Restaurant, (rest) => rest.managers, { onDelete: 'CASCADE' })
  restaurant: Restaurant;
}
