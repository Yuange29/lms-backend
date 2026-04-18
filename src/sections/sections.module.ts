import { CoursesModule } from 'src/courses/courses.module';
import { Lesson } from 'src/lessons/entities/lesson.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Section } from './entities/section.entity';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';

@Module({
  imports: [TypeOrmModule.forFeature([Section, Lesson]), CoursesModule],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
