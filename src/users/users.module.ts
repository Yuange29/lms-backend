import { Course } from 'src/courses/entities/course.entity';
import { Enrollment } from 'src/enrollments/entities/enrollent.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import { Role } from 'src/users/entity/role.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Course,
      Enrollment,
      Progress,
      Submission,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
