import { Enrollment } from 'src/enrollments/entities/enrollent.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Section } from 'src/sections/entities/section.entity';
import { User } from 'src/users/entity/users.entity';
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

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ nullable: true, default: '' })
  thumbnail_url!: string;

  @Column()
  instructor_id!: string;

  @ManyToOne(() => User, (user) => user.courses, { nullable: true })
  @JoinColumn({ name: 'instructor_id' })
  instructor!: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column({ default: false })
  published!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Section, (section) => section.course, { nullable: true })
  sections!: Section[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course, {
    nullable: true,
  })
  enrollments!: Enrollment[];

  @OneToMany(() => Quiz, (quiz) => quiz.course, { nullable: true })
  quizzes!: Quiz[];
}
