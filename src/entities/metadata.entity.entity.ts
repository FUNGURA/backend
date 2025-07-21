import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class MetaData extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string = uuidv4();

  @Column({ type: 'boolean', default: false })
  deletedStatus: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  doneBy: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updatedBy: string;
}
