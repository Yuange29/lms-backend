import { Role } from 'src/common/enums/roles.enum';
import { Course } from 'src/courses/entities/course.entity';
import { CoursesService } from 'src/courses/courses.service';
import { EntityManager, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    private readonly courseService: CoursesService,
  ) {}

  async get(courseId: string, userId: string, role: Role) {
    await this.courseService.findOne(courseId, userId, role);

    return await this.sectionRepository.find({
      where: { course_id: courseId },
      relations: ['lessons', 'course'],
      order: { order_index: 'ASC', lessons: { order_index: 'ASC' } },
    });
  }

  async create(
    courseId: string,
    instructorId: string,
    createReq: CreateSectionDto,
    role: Role,
  ) {
    const course = await this.courseService.findOne(
      courseId,
      instructorId,
      role,
    );
    this.courseService.checkManage(course, instructorId, role);

    return await this.sectionRepository.manager.transaction(async (manager) => {
      await manager.getRepository(Course).findOne({
        where: { id: courseId },
        lock: { mode: 'pessimistic_write' },
      });

      const sectionRepository = manager.getRepository(Section);
      const lastSection = await sectionRepository.findOne({
        where: { course_id: courseId },
        order: { order_index: 'DESC' },
      });

      return await sectionRepository.save(
        sectionRepository.create({
          ...createReq,
          course_id: courseId,
          order_index: (lastSection?.order_index ?? -1) + 1,
        }),
      );
    });
  }

  async update(
    courseId: string,
    sectionId: string,
    instructorId: string,
    updateReq: UpdateSectionDto,
    role: Role,
  ) {
    const course = await this.courseService.findOne(
      courseId,
      instructorId,
      role,
    );
    this.courseService.checkManage(course, instructorId, role);

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, course_id: courseId },
    });

    if (!section) throw new NotFoundException('Not found section');

    Object.assign(section, updateReq);

    return await this.sectionRepository.save(section);
  }

  async delete(
    courseId: string,
    sectionId: string,
    instructorId: string,
    role: Role,
  ) {
    const course = await this.courseService.findOne(
      courseId,
      instructorId,
      role,
    );
    this.courseService.checkManage(course, instructorId, role);

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, course_id: courseId },
    });

    if (!section) throw new NotFoundException('Not found section');

    await this.sectionRepository.manager.transaction(async (manager) => {
      await manager.remove(Section, section);
      await this.reindexSections(courseId, manager);
    });

    return;
  }

  private async reindexSections(courseId: string, manager: EntityManager) {
    const sectionRepository = manager.getRepository(Section);
    const sections = await sectionRepository.find({
      where: { course_id: courseId },
      order: { order_index: 'ASC', created_at: 'ASC' },
    });

    const sectionsNeedUpdate = sections.filter(
      (section, index) => section.order_index !== index,
    );

    if (sectionsNeedUpdate.length === 0) {
      return;
    }

    for (const [index, section] of sections.entries()) {
      section.order_index = index;
    }

    await sectionRepository.save(sections);
  }
}
