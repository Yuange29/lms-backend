import { Roles } from 'src/common/decorators/check-roles.decorator';
import { GetUser } from 'src/common/decorators/current-user.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/role-check.guard';

import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(JwtAccessGuard, RolesGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Roles(Role.student)
  @Post('lessons/:lessonId/complete')
  async completeLesson(
    @Param('lessonId') lessonId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.complete(userId, lessonId);
  }

  @Roles(Role.student)
  @Delete('lessons/:lessonId/complete')
  async uncompleteLesson(
    @Param('lessonId') lessonId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.uncompleted(userId, lessonId);
  }

  @Roles(Role.student)
  @Get('my')
  getMyCourseProgress(
    @Query('course_id') courseId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.getMyCourseProgress(userId, courseId);
  }
}

// GET /progress/my?course_id=
// # student xem progress theo course
// POST   /progress/lessons/:lessonId/complete
// DELETE /progress/lessons/:lessonId/complete
