import { CheckOwner } from 'src/common/decorators/check-owner.decorator';
import { Roles } from 'src/common/decorators/check-roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { OwnershipGuard } from 'src/common/guards/owner-check.guard';
import { RolesGuard } from 'src/common/guards/role-check.guard';

import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answers.dto';
import { UpdateAnswerDto } from './dto/update-answers.dto';

@Controller('questions')
@UseGuards(JwtAccessGuard)
export class AnswersController {
  constructor(private readonly answerService: AnswersService) {}

  @UseGuards(RolesGuard, OwnershipGuard)
  @Roles(Role.instructor, Role.instructor)
  @CheckOwner({ entity: 'answer' })
  @Post(':questionId/answers')
  async creatAnswer(
    @Param('questionId') questionId: string,
    @Body() createReq: CreateAnswerDto,
  ) {
    return { answer: await this.answerService.create(createReq, questionId) };
  }

  @UseGuards(RolesGuard, OwnershipGuard)
  @Roles(Role.instructor, Role.instructor)
  @CheckOwner({ entity: 'answer' })
  @Patch(':questionId/answers:answerId')
  async updateAnswer(
    @Param('questionId') questionId: string,
    @Param('answerId') answerId: string,
    @Body() updateReq: UpdateAnswerDto,
  ) {
    return {
      answer: await this.answerService.update(updateReq, questionId, answerId),
    };
  }
  @UseGuards(RolesGuard, OwnershipGuard)
  @Roles(Role.instructor, Role.instructor)
  @CheckOwner({ entity: 'answer' })
  @Delete(':questionId/answers:answerId')
  async deleteAnswer(
    @Param('questionId') questionId: string,
    @Param('answerId') answerId: string,
  ) {
    return await this.answerService.delete(questionId, answerId);
  }
}
// POST   /questions/:questionId/answers
// PATCH  /questions/:questionId/answers/:answerId
// DELETE /questions/:questionId/answers/:answerId
