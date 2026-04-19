import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/role-check.guard';

import { Controller, UseGuards } from '@nestjs/common';

import { LessonsService } from './lessons.service';

@Controller('sections')
@UseGuards(JwtAccessGuard, RolesGuard)
export class LessonsController {
  constructor(private readonly lessonService: LessonsService) {}
}

// GET    sections/:sectionId/lessons
// POST   sections/:sectionId/lessons
// PATCH  sections/:sectionId/lessons/:lessonId
// DELETE sections/:sectionId/lessons/:lessonId
