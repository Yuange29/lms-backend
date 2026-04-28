import { Submission } from 'src/submissions/entities/submission.entity';
import { Repository } from 'typeorm';

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Quiz } from './entities/quiz.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Submission)
    private readonly subRepository: Repository<Submission>,
  ) {}

  async getQuizzesByCourseId(courseId: string) {
    return await this.quizRepository.find({
      where: { course_id: courseId },
      relations: ['course'],
      order: { created_at: 'DESC' },
    });
  }

  async getQuizById(courseId: string, quizId: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId, course_id: courseId },
      relations: ['questions', 'questions.answers'],
      select: {
        id: true,
        course_id: true,
        title: true,
        description: true,
        time_limit: true,
        questions: {
          id: true,
          type: true,
          question_text: true,
          answers: {
            id: true,
            answer_text: true,
            question_id: true,
            is_correct: true,
          },
        },
      },
      order: { questions: { order_index: 'ASC' } },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async createQuiz(courseId: string, createReq: CreateQuizDto) {
    return await this.quizRepository.save(
      this.quizRepository.create({
        ...createReq,
        course_id: courseId,
      }),
    );
  }

  async updateQuizById(
    courseId: string,
    quizId: string,
    updateReq: UpdateQuizDto,
  ) {
    const quiz = await this.getQuizById(courseId, quizId);

    Object.assign(quiz, updateReq);

    return await this.quizRepository.save(quiz);
  }

  async deleteQuizyId(courseId: string, quizId: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId, course_id: courseId },
      relations: ['submissions'],
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    if (quiz?.submissions)
      throw new ConflictException('This quiz already have submission');

    return await this.quizRepository.remove(quiz);
  }
}
