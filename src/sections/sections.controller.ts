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

import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionsService } from './sections.service';

@Controller('courses')
@UseGuards(JwtAccessGuard, RolesGuard)
export class SectionsController {
  constructor(private readonly sectionService: SectionsService) {}

  @Roles(Role.student, Role.instructor, Role.admin)
  @Get(':courseId/sections')
  async getSections(
    @Param('courseId') courseId: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: Role,
  ) {
    return { sections: await this.sectionService.get(courseId, userId, role) };
  }

  @Roles(Role.instructor, Role.admin)
  @Post(':courseId/sections')
  async createSection(
    @Param('courseId') courseId: string,
    @Body() request: CreateSectionDto,
    @GetUser('id') userId: string,
    @GetUser('role') role: Role,
  ) {
    return {
      section: await this.sectionService.create(
        courseId,
        userId,
        request,
        role,
      ),
    };
  }

  @Roles(Role.instructor, Role.admin)
  @Patch(':courseId/sections/:sectionId')
  async updateSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Body() request: UpdateSectionDto,
    @GetUser('id') instructorId: string,
    @GetUser('role') role: Role,
  ) {
    return {
      section: await this.sectionService.update(
        courseId,
        sectionId,
        instructorId,
        request,
        role,
      ),
    };
  }

  @Roles(Role.instructor, Role.admin)
  @Delete(':courseId/sections/:sectionId')
  async deleteSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @GetUser('id') instructorId: string,
    @GetUser('role') role: Role,
  ) {
    await this.sectionService.delete(courseId, sectionId, instructorId, role);
    return {
      message: 'Section deleted successfully',
    };
  }
}
// GET    /courses/:id/sections
// POST   /courses/:id/sections
// PATCH  /courses/:courseId/sections/:sectionId
// DELETE /courses/:courseId/sections/:sectionId
