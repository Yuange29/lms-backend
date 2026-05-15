import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAnswerDto } from './dto/create-answers.dto';
import { UpdateAnswerDto } from './dto/update-answers.dto';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
  ) {}

  async create(createReq: CreateAnswerDto, questionId: string) {
    return await this.answerRepo.save(
      this.answerRepo.create({
        ...createReq,
        question_id: questionId,
      }),
    );
  }

  async update(
    updateReq: UpdateAnswerDto,
    questionId: string,
    answerId: string,
  ) {
    const answer = await this.getAnswer(questionId, answerId);

    Object.assign(answer, updateReq);

    return await this.answerRepo.save(answer);
  }

  async delete(questionId: string, answerId: string) {
    const answer = await this.getAnswer(questionId, answerId);

    if (answer.submission_answers.length > 0)
      throw new ConflictException('Still have submission answers');

    return await this.answerRepo.remove(answer);
  }

  async getAnswer(questionId: string, answerId: string) {
    const answer = await this.answerRepo.findOne({
      where: { id: answerId, question_id: questionId },
      relations: ['submission_answers'],
    });

    if (!answer) throw new NotFoundException('Not found this answer');

    return answer;
  }
}

// POST   /questions/:questionId/answers
// PATCH  /questions/:questionId/answers/:answerId
// DELETE /questions/:questionId/answers/:answerId
