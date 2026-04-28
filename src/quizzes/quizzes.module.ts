import { CommonModule } from 'src/common/common.module';
import { Course } from 'src/courses/entities/course.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Submission } from 'src/submissions/entities/submission.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Quiz } from './entities/quiz.entity';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Course, Question, Submission]),
    CommonModule,
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizzesModule {}
