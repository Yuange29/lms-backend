import { Enrollment } from 'src/enrollments/entities/enrollent.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { User } from 'src/users/entity/users.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Progress } from './entities/progress.entity';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [TypeOrmModule.forFeature([Progress, User, Lesson, Enrollment])],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
