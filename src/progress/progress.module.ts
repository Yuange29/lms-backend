import { Lesson } from 'src/lessons/entities/lesson.entity';
import { User } from 'src/users/entity/users.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Progress } from './entities/progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Progress, User, Lesson])],
})
export class ProgressModule {}
