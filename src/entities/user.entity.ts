import { Column, Entity } from 'typeorm';
import { MetaData } from './metadata.entity.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UGender, URole } from 'src/enum';
@Entity('system_users')
export class User extends MetaData {
  @Column({ type: 'varchar', length: 255 })
  @IsString()
  firstname: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  lastname: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsString()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: UGender,
    default: UGender.PREFER_NOT_TO_SAY,
  })
  @IsEnum(UGender)
  gender: UGender;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  phoneNumber: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    length: 50,
    enum: URole,
    default: URole.CLIENT,
  })
  @IsEnum(URole)
  role: URole;
}
