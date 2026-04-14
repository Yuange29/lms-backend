import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { Role, Roles } from 'src/common/decorators/check-roles.decorator';
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

import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
@UseGuards(JwtAccessGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // admin
  @Roles(Role.admin)
  @Get()
  getAllRole() {
    return this.roleService.getRoles();
  }

  @Roles(Role.admin)
  @Post()
  createNewRole(@Body() request: CreateRoleDto) {
    return this.roleService.createRole(request);
  }

  @Roles(Role.admin)
  @Patch(':id')
  updateRoleInfo(@Param('id') id: string, request: CreateRoleDto) {
    return this.roleService.updateRole(id, request);
  }

  @Roles(Role.admin)
  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
