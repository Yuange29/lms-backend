import { Progress } from 'src/progress/entities/progress.entity';
import { Section } from 'src/sections/entities/section.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Lesson } from './entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Progress, Section])],
})
export class LessonsModule {}
