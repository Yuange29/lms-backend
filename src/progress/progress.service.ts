import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { Enrollment } from 'src/enrollments/entities/enrollent.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { In, Repository } from 'typeorm';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Enrollment)
    private readonly enrollRepository: Repository<Enrollment>,
  ) {}

  async complete(userId: string, lessonId: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['section', 'section.course'],
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const courseId = lesson.section.course_id;
    const enroll = await this.enrollRepository.findOne({
      where: {
        course_id: courseId,
        user_id: userId,
        status: EnrollmentStatus.active,
      },
    });
    if (!enroll)
      throw new ForbiddenException('you are not enrolled in this course');

    let progress = await this.progressRepository.findOne({
      where: { user_id: userId, lesson_id: lessonId },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        user_id: userId,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date(),
      });
    } else if (!progress.is_completed) {
      progress.is_completed = true;
      progress.completed_at = new Date();
    }

    await this.progressRepository.save(progress);

    const couseProgress = await this.calculateCourseProgress(userId, courseId);

    if (couseProgress.percentage == 100) {
      await this.enrollRepository.update(
        { user_id: userId, course_id: courseId },
        { status: EnrollmentStatus.completed },
      );
    }

    return {
      lesson_id: lessonId,
      is_completed: true,
      course_progress: couseProgress,
    };
  }

  async uncompleted(userId: string, lessonId: string) {
    const progress = await this.progressRepository.findOne({
      where: { user_id: userId, lesson_id: lessonId },
    });

    if (!progress || !progress.is_completed)
      throw new BadRequestException('Lesson is not completed yet');

    progress.is_completed = false;
    progress.completed_at = null;
    await this.progressRepository.save(progress);

    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['section'],
    });

    await this.enrollRepository.update(
      {
        user_id: userId,
        course_id: lesson?.section.course_id,
        status: EnrollmentStatus.completed,
      },
      { status: EnrollmentStatus.active },
    );

    return { lesson_id: lessonId, is_completed: false };
  }

  async getMyCourseProgress(userId: string, courseId: string) {
    const enrollment = await this.enrollRepository.findOne({
      where: { user_id: userId, course_id: courseId },
    });
    if (!enrollment) throw new ForbiddenException('You are not enrolled yet');
    return this.calculateCourseProgress(userId, courseId);
  }

  private async calculateCourseProgress(userId: string, courseId: string) {
    const allLesson = await this.lessonRepository
      .createQueryBuilder('lesson')
      .innerJoin('lesson.section', 'section')
      .where('section.course_id = :courseId', { courseId })
      .getMany();

    const totalLessons = allLesson.length;
    if (totalLessons == 0)
      return { percentage: 0, completed: 0, total: 0, lesson: [] };

    const lessonIds = allLesson.map((i) => i.id);

    const completedProgress = await this.progressRepository.find({
      where: { user_id: userId, lesson_id: In(lessonIds), is_completed: true },
    });

    const completedIds = new Set(completedProgress.map((p) => p.lesson_id));

    return {
      percentage: Math.round((completedIds.size / totalLessons) * 100),
      completed: completedIds.size,
      total: totalLessons,
      lesson: allLesson.map((l) => ({
        lessonId: l.id,
        title: l.title,
        is_completed: completedIds.has(l.id),
      })),
    };
  }
}
// GET    /progress/my?lesson_id=
// # student xem progress theo course
// POST   /progress/lessons/:lessonId/complete
// DELETE /progress/lessons/:lessonId/complete
