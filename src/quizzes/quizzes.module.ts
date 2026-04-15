import { Course } from 'src/courses/entities/course.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Submission } from 'src/submissions/entities/submission.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Quiz } from './entities/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Course, Question, Submission])],
})
export class QuizzesModule {}
