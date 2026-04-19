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
  Query,
  UseGuards,
} from '@nestjs/common';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
@UseGuards(JwtAccessGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Roles(Role.admin, Role.instructor, Role.student)
  @Get()
  async getAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    return {
      courses: await this.courseService.findAll(pageNumber, limitNumber),
    };
  }

  @Roles(Role.instructor)
  @Get('my')
  async getUserCourse(@GetUser() user: AuthUser) {
    return { courses: await this.courseService.myCourses(user) };
  }

  @Roles(Role.admin, Role.instructor, Role.student)
  @Get(':id')
  async getInfo(@Param('id') id: string, @GetUser() user: AuthUser) {
    return { course: await this.courseService.findOne(id, user) };
  }

  @Roles(Role.instructor)
  @Post()
  async createCourse(
    @Body() request: CreateCourseDto,
    @GetUser('id') instructorId: string,
  ) {
    return { course: await this.courseService.create(request, instructorId) };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'course' })
  @Patch(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body() request: UpdateCourseDto,
  ) {
    return {
      course: await this.courseService.update(id, request),
    };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'course' })
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return { course: await this.courseService.delete(id) };
  }

  @UseGuards(OwnershipGuard)
  @Roles(Role.instructor, Role.admin)
  @CheckOwner({ entity: 'course' })
  @Patch(':id/publish')
  async togglePublish(@Param('id') id: string) {
    return { course: await this.courseService.togglePublish(id) };
  }
}
