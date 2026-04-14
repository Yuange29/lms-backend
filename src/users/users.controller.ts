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
  UseGuards,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto copy';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAccessGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles(Role.admin)
  @Get('all')
  async getAllUser() {
    return await this.userService.getUsers();
  }

  @Roles(Role.admin, Role.instructor, Role.student)
  @Get(':user_id')
  async getUser(@Param('user_id') user_id: string) {
    return await this.userService.getUser(user_id);
  }

  @Roles(Role.admin, Role.instructor, Role.student)
  @Patch(':user_id')
  async updateUserInfo(
    @Param('user_id') user_id: string,
    @Body() request: UpdateUserDto,
  ) {
    return await this.userService.updateUser(user_id, request);
  }

  @Roles(Role.admin, Role.instructor, Role.student)
  @Delete(':user_id')
  async deleteUser(@Param('user_id') user_id: string) {
    return await this.userService.deleteUser(user_id);
  }

  @Roles(Role.admin, Role.instructor, Role.student)
  @Patch('change-password:id')
  async changePassword(@Param('id') id: string, @Body() newPass: string) {
    return await this.userService.changePassword(id, newPass);
  }
}
