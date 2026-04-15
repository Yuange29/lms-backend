import { Course } from 'src/courses/entities/course.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Section } from './entities/section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Section, Course, Lesson])],
})
export class SectionsModule {}
