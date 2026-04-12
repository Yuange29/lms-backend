import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Exclude() // exclude can hide this attribute when show User
  @Column()
  password!: string;

  @Column()
  full_name!: string;

  @Column({ nullable: true })
  avatar_url!: string;

  @Column()
  role_id!: string;

  @Exclude()
  @Column({ nullable: true })
  refresh_token!: string;

  @CreateDateColumn()
  create_at!: Date;

  @UpdateDateColumn()
  update_at!: Date;
}
