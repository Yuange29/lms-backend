import { Answer } from 'src/answers/entities/answer.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { User } from 'src/users/entity/users.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubmissionAnswer } from './entities/submission-answer.entity';
import { Submission } from './entities/submission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Submission,
      SubmissionAnswer,
      Quiz,
      User,
      Answer,
      User,
    ]),
  ],
})
export class SubmissionsModule {}
