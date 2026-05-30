import { AuthUser } from 'src/common/interfaces/auth-user.interface';
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

  async create(createReq: CreateSectionDto, courseId: string) {
    await this.courseService.findCourseById(courseId);

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

  // don't show section if course is not published, unless user is admin or owning instructor
  async getSection(sectionId: string, courseId: string, user: AuthUser) {
    await this.courseService.findOne(courseId, user);

    return await this.sectionRepository.findOne({
      where: { id: sectionId, course_id: courseId },
      relations: ['lessons'],
      order: { lessons: { order_index: 'ASC' } },
    });
  }

  async update(
    sectionId: string,
    courseId: string,
    updateReq: UpdateSectionDto,
  ) {
    await this.courseService.findCourseById(courseId);

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, course_id: courseId },
    });

    if (!section) throw new NotFoundException("Section doesn't exist");

    Object.assign(section, updateReq);

    return await this.sectionRepository.save(section);
  }

  async delete(courseId: string, sectionId: string) {
    await this.courseService.findCourseById(courseId);

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, course_id: courseId },
    });

    if (!section) throw new NotFoundException("Section doesn't exist");

    return await this.sectionRepository.remove(section);
  }
}
