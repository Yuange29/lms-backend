import { Course } from 'src/courses/entities/course.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  course_id!: string;

  @ManyToOne(() => Course, (course) => course.quizzes, { nullable: true })
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ nullable: true })
  time_limit!: number; // seconds

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Question, (question) => question.quiz, { nullable: true })
  questions!: Question[];

  @OneToMany(() => Submission, (submission) => submission.quiz, {
    nullable: true,
  })
  submissions!: Submission[];
}
