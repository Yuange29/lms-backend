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
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@Controller('sections')
@UseGuards(JwtAccessGuard, RolesGuard)
export class LessonsController {
  constructor(private readonly lessonService: LessonsService) {}

  @Roles(Role.admin, Role.instructor, Role.student)
  @Get(':sectionId/lessons')
  async getLesson(@Param('sectionId') sectionId: string) {
    return { lessons: await this.lessonService.get(sectionId) };
  }

  @Roles(Role.admin, Role.instructor)
  @Post(':sectionId/lessons')
  async createLesson(
    @Param('sectionId') sectionId: string,
    @Body() createData: CreateLessonDto,
  ) {
    return { lesson: await this.lessonService.create(sectionId, createData) };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.admin, Role.instructor)
  @CheckOwner({ entity: 'lesson' })
  @Patch(':sectionId/lessons/:lessonId')
  async updateLesson(
    @Param('sectionId') sectionId: string,
    @Param('lessonId') lessonId: string,
    @Body() updateData: UpdateLessonDto,
  ) {
    return {
      lesson: await this.lessonService.update(sectionId, lessonId, updateData),
    };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.admin, Role.instructor)
  @CheckOwner({ entity: 'lesson' })
  @Delete(':sectionId/lessons/:lessonId')
  async deleteLesson(
    @Param('sectionId') sectionId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return await this.lessonService.delete(sectionId, lessonId);
  }
}
