import { Repository } from 'typeorm';

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
  ) {}

  async get(sectionId: string) {
    const lessons = await this.lessonRepository.find({
      where: { section: { id: sectionId } },
      relations: ['section'],
    });

    if (!lessons.length)
      throw new NotFoundException('No lessons found for the specified section');

    return lessons;
  }

  async create(sectionId: string, createData: CreateLessonDto) {
    const lastLesson = await this.lessonRepository.findOne({
      where: { section_id: sectionId },
      order: { order_index: 'DESC' },
    });

    return await this.lessonRepository.save(
      this.lessonRepository.create({
        ...createData,
        section_id: sectionId,
        order_index: (lastLesson?.order_index ?? -1) + 1,
      }),
    );
  }

  async update(
    sectionId: string,
    lessonId: string,
    updateData: UpdateLessonDto,
  ) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId, section_id: sectionId },
    });

    if (!lesson) throw new NotFoundException('lesson not found');

    Object.assign(lesson, updateData);

    return await this.lessonRepository.save(lesson);
  }

  async delete(sectionId: string, lessonId: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId, section_id: sectionId },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');

    await this.lessonRepository.remove(lesson);
  }
}
