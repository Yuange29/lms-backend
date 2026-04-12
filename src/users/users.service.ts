import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateUserDto } from './dto/update-user.dto copy';
import { User } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async getUser(user_id: string) {
    return this.userRepository.findOne({ where: { id: user_id } });
  }

  async updateUser(user_id: string, req: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });

    if (!user) throw new Error('User not exist');

    Object.assign(user, req);

    return this.userRepository.save(user);
  }

  async deleteUser(user_id: string) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });

    if (!user) throw new Error('User not exist');

    return this.userRepository.delete({ id: user_id });
  }
}

// GET    /users/:id/enrollments  --> danh sách khóa học đã đăng ký
// GET    /users/:id/progress     --> tiến độ học
// GET    /users/:id/submissions  --> lịch sử làm quiz
