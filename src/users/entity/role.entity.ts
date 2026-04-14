import { User } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @OneToMany(() => User, (user) => user.role)
  users?: User[];
}
