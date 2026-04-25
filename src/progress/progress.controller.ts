import { GetUser } from 'src/common/decorators/current-user.decorator';

import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';

import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('lessons/:lessonId/complete')
  async completeLesson(
    @Param('lessonId') lessonId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.complete(userId, lessonId);
  }

  @Delete('lessons/:lessonId/complete')
  async uncompleteLesson(
    @Param('lessonId') lessonId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.uncompleted(userId, lessonId);
  }

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
