import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateQuestionsDto } from './dto/create-questions.dto';
import { UpdateQuestionsDto } from './dto/update-questions.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async getAllQuestion(quizId: string) {
    return await this.questionRepo.find({
      where: { quiz_id: quizId },
      relations: ['answers'],
    });
  }

  async create(createReq: CreateQuestionsDto, quizId: string) {
    const lastQuestionOrder = await this.questionRepo.findOne({
      where: { quiz_id: quizId },
      order: { order_index: 'DESC' },
    });

    return await this.questionRepo.save(
      this.questionRepo.create({
        ...createReq,
        quiz_id: quizId,
        order_index: (lastQuestionOrder?.order_index ?? -1) + 1,
      }),
    );
  }

  async update(updateReq: UpdateQuestionsDto, quizId: string, quesId: string) {
    const question = await this.getQuestion(quizId, quesId);

    Object.assign(question, updateReq);

    return await this.questionRepo.save(question);
  }

  async delete(quizId: string, questId: string) {
    const question = await this.getQuestion(quizId, questId);

    if (question.answers.length > 0)
      throw new ConflictException('Still exist answers');

    return this.questionRepo.remove(question);
  }

  async getQuestion(quizId: string, questId: string) {
    const question = await this.questionRepo.findOne({
      where: { quiz_id: quizId, id: questId },
      relations: ['answers'],
    });

    if (!question) throw new NotFoundException('Not found this question');

    return question;
  }
}
// GET    /quizzes/:quizId/questions
// POST   /quizzes/:quizId/questions
// PATCH  /quizzes/:quizId/questions/:questionId
// DELETE /quizzes/:quizId/questions/:questionId
