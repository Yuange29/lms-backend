import { GetUser } from 'src/common/decorators/current-user.decorator';

import { Controller, Get, Param, Patch } from '@nestjs/common';

import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('my/lessonId')
  async find(
    @GetUser('id') userId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return {
      progress: await this.progressService.findProgressByCourseId(
        userId,
        lessonId,
      ),
    };
  }

  @Patch('lessons/:lessonId/complete')
  async complete(
    @GetUser('id') userId: string,
    @Param('lessonId') lessonId: string,
  ) {
    await this.progressService.completeLesson(userId, lessonId);
  }
}
// GET    /progress/my?lesson_id=
// # student xem progress theo course
// POST   /progress/lessons/:lessonId/complete
// DELETE /progress/lessons/:lessonId/complete
