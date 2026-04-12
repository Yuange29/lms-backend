import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/entity/role.entity';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto copy';
import { User } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async getUser(user_id: string) {
    return this.userRepository.findOne({ where: { id: user_id } });
  }

  async createUser(createReq: CreateUserDto) {
    const exist = await this.userRepository.findOne({
      where: { email: createReq.email },
    });

    if (exist) throw new ConflictException('User has been created');

    const hashPassword = await bcrypt.hash(createReq.password, 10);

    const studentRole = await this.roleRepository.findOne({
      where: { role: 'STUDENT' },
    });

    const user = this.userRepository.create({
      ...createReq,
      role_id: studentRole?.id,
      password: hashPassword,
    });

    return this.userRepository.save(user);
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
