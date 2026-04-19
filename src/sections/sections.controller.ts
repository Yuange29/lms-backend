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

import { CreateSectionDto } from './dto/create-section.dto';
import { SectionsService } from './sections.service';

@Controller('courses')
@UseGuards(JwtAccessGuard, RolesGuard)
export class SectionsController {
  constructor(private readonly sectionService: SectionsService) {}

  @Roles(Role.admin, Role.instructor)
  @Post(':courseId/sections')
  async createSection(
    @Param('courseId') courseId: string,
    @Body() request: CreateSectionDto,
  ) {
    return { section: await this.sectionService.create(request, courseId) };
  }

  @Roles(Role.admin, Role.instructor, Role.student)
  @Get(':courseId/sections/:sectionId')
  async getSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @GetUser() user: AuthUser,
  ) {
    return await this.sectionService.getSection(sectionId, courseId, user);
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'section' })
  @Patch(':courseId/sections/:sectionId')
  async updateSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Body() request: CreateSectionDto,
  ) {
    return {
      section: await this.sectionService.update(sectionId, courseId, request),
    };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'section' })
  @Delete(':courseId/sections/:sectionId')
  async deleteSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
  ) {
    return await this.sectionService.delete(courseId, sectionId);
  }
}
