import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type ROLE = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  role!: ROLE;

  @CreateDateColumn()
  create_at!: Date;
}
