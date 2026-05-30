import { CheckOwner } from 'src/common/decorators/check-owner.decorator';
import { Roles } from 'src/common/decorators/check-roles.decorator';
import { GetUser } from 'src/common/decorators/current-user.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { OwnershipGuard } from 'src/common/guards/owner-check.guard';
import { RolesGuard } from 'src/common/guards/role-check.guard';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';
import { QuestionsService } from 'src/questions/questions.service';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateQuestionsDto } from './dto/create-questions.dto';
import { UpdateQuestionsDto } from './dto/update-questions.dto';

@Controller('quizzes')
@UseGuards(JwtAccessGuard, RolesGuard)
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @Roles(Role.student, Role.instructor, Role.admin)
  @Get(':quizId/questions')
  async getQuestions(
    @Param('quizId') quizId: string,
    @GetUser() user: AuthUser,
  ) {
    return {
      questions: await this.questionService.getAllQuestion(quizId, user),
    };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'quiz', paramKey: 'quizId' })
  @Post(':quizId/questions')
  async createQuestion(
    @Param('quizId') quizId: string,
    @Body() createReq: CreateQuestionsDto,
  ) {
    return { question: await this.questionService.create(createReq, quizId) };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'question', paramKey: 'questionId' })
  @Patch(':quizId/questions/:questionId')
  async updateQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Body() updateReq: UpdateQuestionsDto,
  ) {
    return {
      question: await this.questionService.update(
        updateReq,
        quizId,
        questionId,
      ),
    };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'question', paramKey: 'questionId' })
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
