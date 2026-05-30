import { Course } from 'src/courses/entities/course.entity';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Enrollment } from './entities/enrollent.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async enroll(userId: string, courseId: string) {
    await this.isCourseActive(courseId);

    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (existingEnrollment)
      throw new ConflictException('Already enrolled in this course');

    const enrollment = this.enrollmentRepository.create({
      user_id: userId,
      course_id: courseId,
    });

    return await this.enrollmentRepository.save(enrollment);
  }

  async getMine(userId: string) {
    return await this.enrollmentRepository.find({
      where: { user_id: userId },
      relations: ['course', 'course.instructor'],
      order: { enrolled_at: 'DESC' },
    });
  }

  async cancelEnrollment(enrollmentId: string, userId: string) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId, user_id: userId },
    });

    if (!enrollment) throw new NotFoundException('Enrollment not found');

    return await this.enrollmentRepository.remove(enrollment);
  }

  async getEnrollers(courseId: string) {
    await this.isCourseActive(courseId);

    return await this.enrollmentRepository.find({
      where: { course_id: courseId },
      relations: ['user'],
      order: { enrolled_at: 'DESC' },
    });
  }

  private async isCourseActive(courseId: string) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId, published: true },
    });

    if (!course)
      throw new NotFoundException('Course not found or not published');

    return course;
  }
}

// POST   /enrollments                        # student tự enroll
// GET    /enrollments/my                     # danh sách course đã enroll
// GET    /enrollments/:id
// PATCH  /enrollments/:id/status             # cancel
// GET    /courses/:id/enrollments            # instructor xem ai đã enroll
