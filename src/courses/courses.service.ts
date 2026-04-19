import { Role } from 'src/common/enums/roles.enum';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';
import { Course } from 'src/courses/entities/course.entity';
import { Enrollment } from 'src/enrollments/entities/enrollent.entity';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createReq: CreateCourseDto, id: string) {
    const course = this.courseRepository.create({
      ...createReq,
      instructor_id: id,
      published: false,
    });

    return await this.courseRepository.save(course);
  }

  async findAll(page: number, limit: number) {
    return await this.courseRepository.find({
      where: { published: true },
      relations: ['instructor'],
      select: {
        id: true,
        title: true,
        price: true,
        thumbnail_url: true,
        created_at: true,
        instructor: {
          id: true,
          full_name: true,
          avatar_url: true,
        },
      },
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async myCourses(user: AuthUser) {
    return await this.courseRepository.find({
      where: { instructor_id: user.id },
      relations: ['instructor'],
      select: {
        id: true,
        title: true,
        price: true,
        thumbnail_url: true,
        created_at: true,
        instructor: {
          id: true,
          full_name: true,
          avatar_url: true,
        },
      },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, user: AuthUser) {
    const course = await this.findCourseById(id);

    if (
      !course.published &&
      user.role !== Role.admin &&
      !(user.role === Role.instructor && course.instructor_id === user.id)
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this course',
      );
    }

    return course;
  }

  async update(id: string, updateReq: UpdateCourseDto) {
    const course = await this.findCourseById(id);

    Object.assign(course, updateReq);

    return await this.courseRepository.save(course);
  }

  async togglePublish(id: string) {
    const course = await this.findCourseById(id);

    course.published = !course.published;

    return await this.courseRepository.save(course);
  }

  async delete(id: string) {
    const course = await this.findCourseById(id);

    const enrollCount = await this.enrollmentRepository.count({
      where: { course_id: id },
    });

    if (enrollCount > 0) {
      throw new BadRequestException(
        "Can't delete this course because it already has enrollments",
      );
    }

    return await this.courseRepository.remove(course);
  }

  async findCourseById(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['instructor', 'sections', 'sections.lessons'],
      order: {
        sections: { order_index: 'ASC', lessons: { order_index: 'ASC' } },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }
}
