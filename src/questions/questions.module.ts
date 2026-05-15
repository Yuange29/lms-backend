import { Answer } from 'src/answers/entities/answer.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { SubmissionAnswer } from 'src/submissions/entities/submission-answer.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Question } from './entities/question.entity';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Answer, Quiz, SubmissionAnswer]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
