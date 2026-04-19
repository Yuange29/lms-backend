import { CommonModule } from 'src/common/common.module';
import { Progress } from 'src/progress/entities/progress.entity';
import { Section } from 'src/sections/entities/section.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Lesson } from './entities/lesson.entity';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Progress, Section]),
    CommonModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
