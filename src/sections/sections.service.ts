import { CoursesService } from 'src/courses/courses.service';
import { Repository } from 'typeorm';

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

  async get(courseId: string, userId: string, role: string | string[]) {
    await this.courseService.findDetail(courseId, userId, role);

    return await this.sectionRepository.find({
      where: { course_id: courseId },
      relations: ['lessons', 'course'],
      order: { order_index: 'DESC', lessons: { order_index: 'DESC' } },
    });
  }

  async create(
    courseId: string,
    instructorId: string,
    createReq: CreateSectionDto,
    role: string | string[],
  ) {
    await this.courseService.findManageDetail(courseId, instructorId, role);

    const lastSection = await this.sectionRepository.findOne({
      where: { course_id: courseId },
      order: { order_index: 'DESC' },
    });

    return await this.sectionRepository.save(
      this.sectionRepository.create({
        ...createReq,
        course_id: courseId,
        order_index: (lastSection?.order_index ?? -1) + 1,
      }),
    );
  }

  async update(
    courseId: string,
    sectionId: string,
    instructorId: string,
    updateReq: UpdateSectionDto,
    role: string | string[],
  ) {
    await this.courseService.findManageDetail(courseId, instructorId, role);

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
    role: string | string[],
  ) {
    await this.courseService.findManageDetail(courseId, instructorId, role);

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, course_id: courseId },
    });

    if (!section) throw new NotFoundException('Not found section');

    return await this.sectionRepository.remove(section);
  }
}
// GET    /courses/:id/sections
// POST   /courses/:id/sections
// PATCH  /courses/:courseId/sections/:sectionId
// DELETE /courses/:courseId/sections/:sectionId
