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

  // path: /courses?page=1&limit=10
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
  async getUserCourse(@GetUser('id') id: string) {
    return { courses: await this.courseService.myCourses(id) };
  }

  @Roles(Role.admin, Role.instructor, Role.student)
  @Get(':id')
  async getInfo(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: Role,
  ) {
    return { course: await this.courseService.findOne(id, userId, role) };
  }

  @Roles(Role.instructor)
  @Post()
  async createCourse(
    @Body() request: CreateCourseDto,
    @GetUser('id') id: string,
  ) {
    return { course: await this.courseService.create(request, id) };
  }

  @Roles(Role.instructor, Role.admin)
  @Patch(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body() request: UpdateCourseDto,
    @GetUser('id') userId: string,
    @GetUser('role') role: Role,
  ) {
    return {
      course: await this.courseService.update(id, request, userId, role),
    };
  }

  @Roles(Role.instructor, Role.admin)
  @Delete(':id')
  async deleteCourse(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: Role,
  ) {
    return { course: await this.courseService.delete(id, userId, role) };
  }

  @Roles(Role.instructor, Role.admin)
  @Patch(':id/publish')
  async togglePublish(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: Role,
  ) {
    return { course: await this.courseService.togglePublish(id, userId, role) };
  }
}
