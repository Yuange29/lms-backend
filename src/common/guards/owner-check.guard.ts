import { Answer } from 'src/answers/entities/answer.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Section } from 'src/sections/entities/section.entity';
import { Repository } from 'typeorm';

import {
    CanActivate, ExecutionContext, ForbiddenException, NotFoundException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { CHECK_OWNER_KEY, OwnershipOptions } from '../decorators/check-owner.decorator';
import { Role } from '../enums/roles.enum';

export class OwnerGuard implements CanActivate {
  constructor(
    private readonly reflect: Reflector,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Section) private sectionRepo: Repository<Section>,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflect.get<OwnershipOptions>(
      CHECK_OWNER_KEY,
      context.getHandler(),
    );

    if (!options) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramKey = options.paramKey ?? 'id';
    const entityId = request.params[paramKey];

    if (user.role?.name === Role.admin) return true;

    const instructorId = await this.resolveInstructorId(
      options.entity,
      entityId,
    );

    if (instructorId === null)
      throw new NotFoundException(`${options.entity} not found`);
    if (instructorId !== user.id)
      throw new ForbiddenException('You do not own this resource');

    return true;
  }

  private async resolveInstructorId(
    entity: string,
    id: string,
  ): Promise<string | null> {
    switch (entity) {
      case 'course': {
        const course = await this.courseRepo.findOneBy({ id });
        return course?.instructor_id ?? null;
      }

      case 'section': {
        const section = await this.sectionRepo.findOne({
          where: { id },
          relations: ['course'],
        });
        return section?.course?.instructor_id ?? null;
      }

      case 'lesson': {
        const lesson = await this.lessonRepo.findOne({
          where: { id },
          relations: ['section', 'section.course'],
        });
        return lesson?.section?.course?.instructor_id ?? null;
      }

      case 'quiz': {
        const quiz = await this.quizRepo.findOne({
          where: { id },
          relations: ['course'],
        });
        return quiz?.course?.instructor_id ?? null;
      }

      case 'question': {
        const question = await this.questionRepo.findOne({
          where: { id },
          relations: ['quiz', 'quiz.course'],
        });
        return question?.quiz?.course?.instructor_id ?? null;
      }

      case 'answer': {
        const answer = await this.answerRepo.findOne({
          where: { id },
          relations: ['question', 'question.quiz', 'question.quiz.course'],
        });
        return answer?.question?.quiz?.course?.instructor_id ?? null;
      }

      default:
        return null;
    }
  }
}
