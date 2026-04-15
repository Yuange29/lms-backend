import { Enrollment } from 'src/enrollments/entities/enrollent.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Section } from 'src/sections/entities/section.entity';
import { User } from 'src/users/entity/users.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './entities/course.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Enrollment, Quiz, Section, User]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
