import { Role } from 'src/common/enums/roles.enum';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';
import { Submission } from 'src/submissions/entities/submission.entity';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getQuizzesByCourseId(courseId: string, user: AuthUser) {
    return await this.quizRepository.find({
      where: { course_id: courseId },
      relations: ['course'],
      order: { created_at: 'DESC' },
    });
  }

  async getQuizById(courseId: string, quizId: string, user: AuthUser) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId, course_id: courseId },
      relations: ['questions', 'questions.answers'],
      order: { questions: { order_index: 'ASC' } },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    const mappedQuestions = quiz.questions.map((question) => ({
      id: question.id,
      quiz_id: question.quiz_id,
      question_text: question.question_text,
      type: question.type,
      order_index: question.order_index,
      answers: question.answers.map((answer) => {
        const baseAnswer = {
          id: answer.id,
          question_id: answer.question_id,
          answer_text: answer.answer_text,
        };

        if (user.role === Role.instructor || user.role === Role.admin) {
          return { ...baseAnswer, is_correct: answer.is_correct };
        }

        return baseAnswer;
      }),
    }));

    return {
      id: quiz.id,
      course_id: quiz.course_id,
      title: quiz.title,
      description: quiz.description,
      time_limit: quiz.time_limit,
      questions: mappedQuestions,
    };
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
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId, course_id: courseId },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    Object.assign(quiz, updateReq);

    return await this.quizRepository.save(quiz);
  }

  async deleteQuizById(courseId: string, quizId: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId, course_id: courseId },
      relations: ['submissions'],
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    if (quiz.submissions?.length > 0)
      throw new ConflictException('This quiz already has submissions');

    return await this.quizRepository.remove(quiz);
  }
}
