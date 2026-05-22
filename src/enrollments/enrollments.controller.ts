import { CheckOwner } from 'src/common/decorators/check-owner.decorator';
import { Roles } from 'src/common/decorators/check-roles.decorator';
import { GetUser } from 'src/common/decorators/current-user.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { OwnershipGuard } from 'src/common/guards/owner-check.guard';
import { RolesGuard } from 'src/common/guards/role-check.guard';

import { Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
@UseGuards(JwtAccessGuard)
export class EnrollmentsController {
  constructor(private readonly enrollService: EnrollmentsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.student)
  @Post(':courseId')
  async enroll(
    @Param('courseId') courseId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.enrollService.enroll(userId, courseId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.student)
  @Get('my')
  async enrolledCourse(@GetUser('id') userId: string) {
    return await this.enrollService.getMine(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.student)
  @Patch(':id/status')
  async updateEnrollmentStatus(
    @Param('id') enrollmentId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.enrollService.cancelEnrollment(enrollmentId, userId);
  }

  @UseGuards(RolesGuard, OwnershipGuard)
  @CheckOwner({ entity: 'course' })
  @Roles(Role.instructor, Role.admin)
  @Get('course/:courseId ')
  async getEnroller(@Param('courseId') courseId: string) {
    return await this.enrollService.getEnrollers(courseId);
  }
}
// POST   /enrollments                        # student tự enroll
// GET    /enrollments/my                     # danh sách course đã enroll
// GET    /enrollments/:id
// PATCH  /enrollments/:id/status             # cancel
// GET    /courses/:id/enrollments            # instructor xem ai đã enroll
