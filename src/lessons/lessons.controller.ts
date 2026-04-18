import { Roles } from 'src/common/decorators/check-roles.decorator';
import { GetUser } from 'src/common/decorators/current-user.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/role-check.guard';

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

import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@Controller('courses')
@UseGuards(JwtAccessGuard, RolesGuard)
export class LessonsController {
  constructor(private readonly lessonService: LessonsService) {}

  @Roles(Role.instructor, Role.admin, Role.student)
  @Get(':courseId/sections/:sectionId/lessons')
  async getLessons(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: Role,
  ) {
    return {
      lessons: await this.lessonService.get(courseId, sectionId, userId, role),
    };
  }

  @Roles(Role.instructor, Role.admin)
  @Post(':courseId/sections/:sectionId/lessons')
  async createLesson(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @GetUser('id') instructorId: string,
    @Body() createReq: CreateLessonDto,
    @GetUser('role') role: Role,
  ) {
    return {
      lesson: await this.lessonService.create(
        courseId,
        sectionId,
        instructorId,
        createReq,
        role,
      ),
    };
  }

  @Roles(Role.instructor, Role.admin)
  @Patch(':courseId/sections/:sectionId/lessons/:lessonId')
  async updateLesson(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Param('lessonId') lessonId: string,
    @GetUser('id') instructorId: string,
    @Body() updateReq: UpdateLessonDto,
    @GetUser('role') role: Role,
  ) {
    return {
      lesson: await this.lessonService.update(
        courseId,
        sectionId,
        lessonId,
        instructorId,
        updateReq,
        role,
      ),
    };
  }

  @Roles(Role.instructor, Role.admin)
  @Delete(':courseId/sections/:sectionId/lessons/:lessonId')
  async deleteLesson(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Param('lessonId') lessonId: string,
    @GetUser('id') instructorId: string,
    @GetUser('role') role: Role,
  ) {
    await this.lessonService.delete(
      courseId,
      sectionId,
      lessonId,
      instructorId,
      role,
    );

    return {
      message: 'Lesson deleted successfully',
    };
  }
}

// GET    /courses/:courseId/sections/:sectionId/lessons
// POST   /courses/:courseId/sections/:sectionId/lessons
// PATCH  /courses/:courseId/sections/:sectionId/lessons/:lessonId
// DELETE /courses/:courseId/sections/:sectionId/lessons/:lessonId
