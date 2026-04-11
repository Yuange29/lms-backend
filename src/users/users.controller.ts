import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto copy';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('all')
  getAllUser() {
    return this.userService.getUsers();
  }

  @Get(':user_id')
  getUser(@Param('user_id') user_id: string) {
    return this.userService.getUser(user_id);
  }

  @Patch(':user_id')
  updateUserInfo(
    @Param('user_id') user_id: string,
    @Body() request: UpdateUserDto,
  ) {
    return this.userService.updateUser(user_id, request);
  }

  @Delete(':user_id')
  deleteUser(@Param('user_id') user_id: string) {
    return this.userService.deleteUser(user_id);
  }
}
