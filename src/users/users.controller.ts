import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';

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
@UseGuards(JwtAccessGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('all')
  async getAllUser() {
    return await this.userService.getUsers();
  }

  @Get(':user_id')
  async getUser(@Param('user_id') user_id: string) {
    return await this.userService.getUser(user_id);
  }

  @Patch(':user_id')
  async updateUserInfo(
    @Param('user_id') user_id: string,
    @Body() request: UpdateUserDto,
  ) {
    return await this.userService.updateUser(user_id, request);
  }

  @Delete(':user_id')
  async deleteUser(@Param('user_id') user_id: string) {
    return await this.userService.deleteUser(user_id);
  }

  @Patch('change-password:id')
  async changePassword(@Param('id') id: string, @Body() newPass: string) {
    return await this.userService.changePassword(id, newPass);
  }
}
