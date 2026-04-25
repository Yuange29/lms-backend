import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
  ) {}

  async findProgressByCourseId(userId: string, lessonId: string) {
    return await this.progressRepository.find({
      where: {
        user_id: userId,
        lesson: {
          id: lessonId,
        },
      },
      relations: ['lesson'],
    });
  }

  async completeLesson(userId: string, lessonId: string) {
    const progress = await this.getProgress(userId, lessonId);
    await this.progressRepository.update(progress.id, {
      is_completed: !progress.is_completed,
    });
  }

  async getProgress(userId: string, lessonId: string) {
    const progress = await this.progressRepository.findOne({
      where: {
        user_id: userId,
        lesson: {
          id: lessonId,
        },
      },
      relations: ['lesson'],
    });

    if (!progress) throw new NotFoundException('Progress not found');

    return progress;
  }
}
// GET    /progress/my?lesson_id=
// # student xem progress theo course
// POST   /progress/lessons/:lessonId/complete
// DELETE /progress/lessons/:lessonId/complete
