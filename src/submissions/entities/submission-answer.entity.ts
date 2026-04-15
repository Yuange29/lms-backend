import { Answer } from 'src/answers/entities/answer.entity';
import { Question } from 'src/questions/entities/question.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Submission } from './submission.entity';

@Entity('submission_answers')
export class SubmissionAnswer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  submission_id!: string;

  @Column()
  question_id!: string;

  @Column()
  answer_id!: string;

  @ManyToOne(() => Submission, (submission) => submission.submission_answers, {
    nullable: true,
  })
  @JoinColumn({ name: 'submission_id' })
  submission!: Submission;

  @ManyToOne(() => Question, (question) => question.submission_answers, {
    nullable: true,
  })
  @JoinColumn({ name: 'question_id' })
  question!: Question;

  @ManyToOne(() => Answer, (answer) => answer.submission_answers, {
    nullable: true,
  })
  @JoinColumn({ name: 'answer_id' })
  answer!: Answer;
}
