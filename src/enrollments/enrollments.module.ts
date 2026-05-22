import { CommonModule } from 'src/common/common.module';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entity/users.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment } from './entities/enrollent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, User, Course]), CommonModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
