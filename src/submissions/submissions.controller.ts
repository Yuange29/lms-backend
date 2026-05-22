import { Roles } from 'src/common/decorators/check-roles.decorator';
import { GetUser } from 'src/common/decorators/current-user.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/role-check.guard';

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { SubmissionAnswersDto } from './dto/create-submissions.dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
@UseGuards(JwtAccessGuard)
export class SubmissionsController {
  constructor(private readonly submissionService: SubmissionsService) {}

  @Post(':quizId')
  @UseGuards(RolesGuard)
  @Roles(Role.student)
  async createSubmission(
    @Param('quizId') quizId: string,
    @GetUser('id') userId: string,
    @Body() createReq: SubmissionAnswersDto,
  ) {
    return await this.submissionService.create(createReq, userId, quizId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.student)
  @Get(':quizId/my')
  async getSubmission(
    @Param('quizId') quizId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.submissionService.getQuiz(quizId, userId);
  }
}
// POST   /quizzes/:quizId/submissions        # student nộp bài
// GET    /quizzes/:quizId/submissions/my     # student xem bài của mình
// GET    /quizzes/:quizId/submissions        # instructor xem tất cả
// GET    /submissions/:id                    # chi tiết bài nộp + submission_answers
