import { Question } from 'src/questions/entities/question.entity';
import { SubmissionAnswer } from 'src/submissions/entities/submission-answer.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Answer } from './entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, SubmissionAnswer])],
})
export class AnswersModule {}
