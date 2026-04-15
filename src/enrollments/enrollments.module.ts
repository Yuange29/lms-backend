import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entity/users.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Enrollment } from './entities/enrollent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, User, Course])],
})
export class EnrollmentsModule {}
