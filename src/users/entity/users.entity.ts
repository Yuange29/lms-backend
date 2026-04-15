import { Exclude } from 'class-transformer';
import { Course } from 'src/courses/entities/course.entity';
import { Enrollment } from 'src/enrollments/entities/enrollent.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import { Role } from 'src/users/entity/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @Column({ nullable: true })
  role_id!: string;

  @ManyToOne(() => Role, (role) => role.users, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Exclude()
  @Column({ nullable: true })
  refresh_token!: string;

  @CreateDateColumn()
  create_at!: Date;

  @UpdateDateColumn()
  update_at!: Date;

  @OneToMany(() => Course, (course) => course.instructor, { nullable: true })
  courses!: Course[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user, {
    nullable: true,
  })
  enrollments!: Enrollment[];

  @OneToMany(() => Progress, (progress) => progress.user, { nullable: true })
  progress!: Progress[];

  @OneToMany(() => Submission, (submission) => submission.user, {
    nullable: true,
  })
  submissions!: Submission[];
}
