import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from '../users/entity/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getRoles() {
    return await this.roleRepository.find();
  }

  async createRole(createReq: CreateRoleDto) {
    return await this.roleRepository.save(createReq);
  }

  async updateRole(id: string, updateReq: CreateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id: id } });

    if (!role) throw new Error('Role not found');

    Object.assign(role, updateReq);

    return await this.roleRepository.save(role);
  }

  async deleteRole(id: string) {
    return this.roleRepository.delete({ id: id });
  }
}
