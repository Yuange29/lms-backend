import { Answer } from 'src/answers/entities/answer.entity';
import { QuestionType } from 'src/common/enums/question-type.enum';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { SubmissionAnswer } from 'src/submissions/entities/submission-answer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  quiz_id!: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { nullable: true })
  @JoinColumn({ name: 'quiz_id' })
  quiz!: Quiz;

  @Column({ type: 'text' })
  question_text!: string;

  @Column()
  type!: QuestionType; // single_choice | multiple_choice

  @Column({ default: 0 })
  order_index!: number;

  @OneToMany(() => Answer, (answer) => answer.question, { nullable: true })
  answers!: Answer[];

  @OneToMany(() => SubmissionAnswer, (sa) => sa.question, { nullable: true })
  submission_answers!: SubmissionAnswer[];
}
