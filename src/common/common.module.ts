import { Answer } from 'src/answers/entities/answer.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Section } from 'src/sections/entities/section.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OwnershipGuard } from './guards/owner-check.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Section, Lesson, Quiz, Question, Answer]),
  ],
  providers: [OwnershipGuard],
  exports: [OwnershipGuard, TypeOrmModule],
})
export class CommonModule {}
