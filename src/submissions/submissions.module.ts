import { Answer } from 'src/answers/entities/answer.entity';
import { Enrollment } from 'src/enrollments/entities/enrollent.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { User } from 'src/users/entity/users.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubmissionAnswer } from './entities/submission-answer.entity';
import { Submission } from './entities/submission.entity';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Submission,
      SubmissionAnswer,
      Quiz,
      User,
      Answer,
      User,
      Enrollment,
      Question,
    ]),
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
