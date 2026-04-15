import { Enrollment } from 'src/enrollments/entities/enrollent.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Section } from 'src/sections/entities/section.entity';
import { User } from 'src/users/entity/users.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Enrollment, Quiz, Section, User]),
  ],
})
export class CoursesModule {}
