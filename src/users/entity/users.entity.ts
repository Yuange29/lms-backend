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

  @Column()
  password!: string;

  @Column()
  full_name!: string;

  @Column({ nullable: true })
  avatar_url!: string;

  @Column()
  role_id!: string;

  @Column({ nullable: true })
  refresh_token!: string;

  @CreateDateColumn()
  create_at!: Date;

  @UpdateDateColumn()
  update_at!: Date;
}
