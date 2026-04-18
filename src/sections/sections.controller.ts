import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/role-check.guard';

import { Controller, UseGuards } from '@nestjs/common';

import { SectionsService } from './sections.service';

@Controller('courses')
@UseGuards(JwtAccessGuard, RolesGuard)
export class SectionsController {
  constructor(private readonly sectionService: SectionsService) {}
}
// GET    /courses/:id/sections
// POST   /courses/:id/sections
// PATCH  /courses/:courseId/sections/:sectionId
// DELETE /courses/:courseId/sections/:sectionId
