import { CheckOwner } from 'src/common/decorators/check-owner.decorator';
import { Roles } from 'src/common/decorators/check-roles.decorator';
import { GetUser } from 'src/common/decorators/current-user.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { OwnershipGuard } from 'src/common/guards/owner-check.guard';
import { RolesGuard } from 'src/common/guards/role-check.guard';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';

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

import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizzesService } from './quizzes.service';

@Controller('courses')
@UseGuards(JwtAccessGuard, RolesGuard)
export class QuizzesController {
  constructor(private readonly quizService: QuizzesService) {}

  @Roles(Role.admin, Role.instructor, Role.student)
  @Get(':courseId/quizzes')
  async getAllQuizInCourse(
    @Param('courseId') courseId: string,
    @GetUser() user: AuthUser,
  ) {
    return {
      quizzes: await this.quizService.getQuizzesByCourseId(courseId, user),
    };
  }

  @Roles(Role.admin, Role.instructor, Role.student)
  @Get(':courseId/quizzes/:quizId')
  async getDetailQuiz(
    @Param('courseId') courseId: string,
    @Param('quizId') quizId: string,
    @GetUser() user: AuthUser,
  ) {
    return { quiz: await this.quizService.getQuizById(courseId, quizId, user) };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'course' })
  @Post(':courseId/quizzes')
  async createQuiz(
    @Param('courseId') courseId: string,
    @Body() createReq: CreateQuizDto,
  ) {
    return { quiz: await this.quizService.createQuiz(courseId, createReq) };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'quiz' })
  @Patch(':courseId/quizzes/:quizId')
  async updateQuiz(
    @Param('courseId') courseId: string,
    @Param('quizId') quizId: string,
    @Body() updateReq: UpdateQuizDto,
  ) {
    return {
      quiz: await this.quizService.updateQuizById(courseId, quizId, updateReq),
    };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.admin, Role.instructor)
  @CheckOwner({ entity: 'quiz' })
  @Delete(':courseId/quizzes/:quizId')
  async deleteQuiz(
    @Param('courseId') courseId: string,
    @Param('quizId') quizId: string,
  ) {
    return await this.quizService.deleteQuizById(courseId, quizId);
  }
}
// GET    /courses/:courseId/quizzes
// GET    /courses/:courseId/quizzes/:quizId
// POST   /courses/:courseId/quizzes          # instructor
// PATCH  /courses/:courseId/quizzes/:quizId  # instructor
// DELETE /courses/:courseId/quizzes/:quizId  # instructor
