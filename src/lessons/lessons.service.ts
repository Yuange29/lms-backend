import { Role } from 'src/common/enums/roles.enum';
import { CoursesService } from 'src/courses/courses.service';
import { Section } from 'src/sections/entities/section.entity';
import { EntityManager, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    private readonly courseService: CoursesService,
  ) {}

  async create(
    courseId: string,
    sectionId: string,
    instructorId: string,
    createReq: CreateLessonDto,
    role: Role,
  ) {
    await this.getSectionOrThrow(courseId, sectionId, instructorId, role, true);

    return await this.lessonRepository.manager.transaction(async (manager) => {
      const sectionRepository = manager.getRepository(Section);
      const lessonRepository = manager.getRepository(Lesson);

      await sectionRepository.findOne({
        where: { id: sectionId, course_id: courseId },
        lock: { mode: 'pessimistic_write' },
      });

      const lastLesson = await lessonRepository.findOne({
        where: { section_id: sectionId },
        order: { order_index: 'DESC' },
      });

      const lesson = lessonRepository.create({
        ...createReq,
        section_id: sectionId,
        order_index: (lastLesson?.order_index ?? -1) + 1,
      });

      return await lessonRepository.save(lesson);
    });
  }

  async get(courseId: string, sectionId: string, userId: string, role: Role) {
    await this.getSectionOrThrow(courseId, sectionId, userId, role);

    return await this.lessonRepository.find({
      where: { section_id: sectionId },
      relations: ['section', 'progress'],
      select: {
        id: true,
        title: true,
        content: true,
        video_url: true,
        duration: true,
        is_preview: true,
        order_index: true,
        created_at: true,
        section: {
          id: true,
          title: true,
        },
        progress: {
          id: true,
          completed_at: true,
        },
      },
      order: { order_index: 'ASC' },
    });
  }

  async update(
    courseId: string,
    sectionId: string,
    lessonId: string,
    instructorId: string,
    updateReq: UpdateLessonDto,
    role: Role,
  ) {
    const lesson = await this.getLesson(
      courseId,
      sectionId,
      lessonId,
      instructorId,
      role,
    );
    Object.assign(lesson, updateReq);
    return await this.lessonRepository.save(lesson);
  }

  async delete(
    courseId: string,
    sectionId: string,
    lessonId: string,
    instructorId: string,
    role: Role,
  ) {
    const lesson = await this.getLesson(
      courseId,
      sectionId,
      lessonId,
      instructorId,
      role,
    );

    await this.lessonRepository.manager.transaction(async (manager) => {
      await manager.remove(Lesson, lesson);
      await this.reindexLessons(sectionId, manager);
    });

    return;
  }

  private async getLesson(
    courseId: string,
    sectionId: string,
    lessonId: string,
    instructorId: string,
    role: Role,
  ) {
    await this.getSectionOrThrow(courseId, sectionId, instructorId, role, true);

    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId, section_id: sectionId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  private async getSectionOrThrow(
    courseId: string,
    sectionId: string,
    userId: string,
    role: Role,
    requireManage = false,
  ) {
    const course = await this.courseService.findOne(courseId, userId, role);

    if (requireManage) {
      this.courseService.checkManage(course, userId, role);
    }

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, course_id: courseId },
    });

    if (!section) {
      throw new NotFoundException('Not found section');
    }

    return section;
  }

  private async reindexLessons(sectionId: string, manager: EntityManager) {
    const lessonRepository = manager.getRepository(Lesson);
    const lessons = await lessonRepository.find({
      where: { section_id: sectionId },
      order: { order_index: 'ASC', created_at: 'ASC' },
    });

    const lessonsNeedUpdate = lessons.filter(
      (lesson, index) => lesson.order_index !== index,
    );

    if (lessonsNeedUpdate.length === 0) {
      return;
    }

    for (const [index, lesson] of lessons.entries()) {
      lesson.order_index = index;
    }

    await lessonRepository.save(lessons);
  }
}
