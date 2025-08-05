import { Column, Entity, OneToMany } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { MenuItem } from './menuItem.entity';
import { OrderItem } from './orderItem.entity';

@Entity('prep_stations')
export class PrepStation extends MetaData {
  @Column({ unique: true })
  name: string; // e.g., "Kitchen", "Bar"

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.prepStation)
  menuItems: MenuItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.prepStation)
  orderItems: OrderItem[];
}
