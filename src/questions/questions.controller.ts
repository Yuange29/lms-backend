import { CheckOwner } from 'src/common/decorators/check-owner.decorator';
import { Roles } from 'src/common/decorators/check-roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { QuestionsService } from 'src/questions/questions.service';

import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateQuestionsDto } from './dto/create-questions.dto';

@Controller('quizzes')
@UseGuards(JwtAccessGuard)
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @Roles(Role.student, Role.instructor, Role.admin)
  @Get(':quizId/questions')
  async getQuestions(@Param('quizId') quizId: string) {
    return { questions: await this.questionService.getAllQuestion(quizId) };
  }

  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'question' })
  @Post(':quizId/questions')
  async createQuestion(
    @Param('quizId') quizId: string,
    createReq: CreateQuestionsDto,
  ) {
    return { question: await this.questionService.create(createReq, quizId) };
  }

  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'question' })
  @Patch(':quizId/questions/:questionId')
  async updateQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    updateReq: CreateQuestionsDto,
  ) {
    return {
      question: await this.questionService.update(
        updateReq,
        quizId,
        questionId,
      ),
    };
  }

  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'question' })
  @Delete(':quizId/questions/:questionId')
  async deleteQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
  ) {
    return await this.questionService.delete(quizId, questionId);
  }
}
// GET    /quizzes/:quizId/questions
// POST   /quizzes/:quizId/questions
// PATCH  /quizzes/:quizId/questions/:questionId
// DELETE /quizzes/:quizId/questions/:questionId
