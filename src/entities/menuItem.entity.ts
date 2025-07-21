import { Column, Entity, ManyToOne } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Manager } from './manager.entity';
import { Restaurant } from './restaurant.entity';
@Entity('menu_items')
export class MenuItem extends MetaData {
  @Column()
  @IsString()
  name: string;

  @Column({ type: 'text' })
  @IsString()
  description: string;

  @Column({ type: 'float' })
  @IsNumber()
  price: number;

  @Column({ type: 'int' })
  @IsNumber()
  preparationTime: number;

  @Column({ default: true })
  @IsBoolean()
  available: boolean;
  @ManyToOne(() => Manager, (manager) => manager.menuItems, {
    onDelete: 'SET NULL',
  })
  manager: Manager;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;
}
