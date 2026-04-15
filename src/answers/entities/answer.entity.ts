import { Question } from 'src/questions/entities/question.entity';
import { SubmissionAnswer } from 'src/submissions/entities/submission-answer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  question_id!: string;

  @ManyToOne(() => Question, (question) => question.answers, { nullable: true })
  @JoinColumn({ name: 'question_id' })
  question!: Question;

  @Column({ type: 'text' })
  answer_text!: string;

  @Column({ default: false })
  is_correct!: boolean;

  @OneToMany(() => SubmissionAnswer, (sa) => sa.answer, { nullable: true })
  submission_answers!: SubmissionAnswer[];
}
