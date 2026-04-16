import { CoursesService } from 'src/courses/courses.service';
import { Course } from 'src/courses/entities/course.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Section } from './entities/section.entity';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';

@Module({
  imports: [TypeOrmModule.forFeature([Section, Course, Lesson])],
  controllers: [SectionsController],
  providers: [SectionsService, CoursesService],
})
export class SectionsModule {}
