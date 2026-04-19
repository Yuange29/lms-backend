import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/role-check.guard';

import { Controller, UseGuards } from '@nestjs/common';

import { LessonsService } from './lessons.service';

@Controller('courses')
@UseGuards(JwtAccessGuard, RolesGuard)
export class LessonsController {
  constructor(private readonly lessonService: LessonsService) {}
}

// GET    /courses/:courseId/sections/:sectionId/lessons
// POST   /courses/:courseId/sections/:sectionId/lessons
// PATCH  /courses/:courseId/sections/:sectionId/lessons/:lessonId
// DELETE /courses/:courseId/sections/:sectionId/lessons/:lessonId
