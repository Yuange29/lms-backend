import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { User } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SubmissionAnswer } from './submission-answer.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  quiz_id!: string;

  @ManyToOne(() => User, (user) => user.submissions, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.submissions, { nullable: true })
  @JoinColumn({ name: 'quiz_id' })
  quiz!: Quiz;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  score!: number;

  @CreateDateColumn()
  submitted_at!: Date;

  @OneToMany(() => SubmissionAnswer, (sa) => sa.submission, { nullable: true })
  submission_answers!: SubmissionAnswer[];
}
