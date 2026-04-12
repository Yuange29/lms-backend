import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // admin
  @Get()
  getAllRole() {
    return this.roleService.getRoles();
  }

  @Post()
  createNewRole(@Body() request: CreateRoleDto) {
    return this.roleService.createRole(request);
  }

  @Patch(':id')
  updateRoleInfo(@Param('id') id: string, request: CreateRoleDto) {
    return this.roleService.updateRole(id, request);
  }

  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
