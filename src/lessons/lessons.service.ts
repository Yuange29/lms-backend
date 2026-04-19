import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async getLesson(sectionId: string, lessonId: string) {}
}
// GET    sections/:sectionId/lessons
// POST   sections/:sectionId/lessons
// PATCH  sections/:sectionId/lessons/:lessonId
// DELETE sections/:sectionId/lessons/:lessonId
