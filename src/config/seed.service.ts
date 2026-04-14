import * as bcrypt from 'bcrypt';
import { Role as r } from 'src/common/enums/roles.enum';
import { Role } from 'src/users/entity/role.entity';
import { User } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onApplicationBootstrap() {
    await this.createRole();
    await this.createAdmin();
  }

  async createRole() {
    const adminExist = await this.roleRepository.findOne({
      where: { role: r.admin },
    });

    if (!adminExist) {
      await this.roleRepository.save(
        this.roleRepository.create({ role: r.admin }),
      );
      console.log('Role admin has been created!');
    }

    const instructorRole = await this.roleRepository.findOne({
      where: { role: r.instructor },
    });

    if (!instructorRole) {
      await this.roleRepository.save(
        this.roleRepository.create({ role: r.instructor }),
      );
      console.log('Role instructor has been created!');
    }

    const studentRole = await this.roleRepository.findOne({
      where: { role: r.student },
    });

    if (!studentRole) {
      await this.roleRepository.save(
        this.roleRepository.create({ role: r.student }),
      );
      console.log('Role student has been created!');
    }
  }

  async createAdmin() {
    const exist = await this.userRepository.findOne({
      where: { role: { role: r.admin } },
      relations: ['role'],
    });

    if (!exist) {
      const hashPw = await bcrypt.hash('#AdmIn@123', 10);
      const adminRole = await this.roleRepository.findOne({
        where: { role: r.admin },
      });
      await this.userRepository.save(
        this.userRepository.create({
          email: 'admin123@gmail.com',
          password: hashPw,
          full_name: 'admin',
          role_id: adminRole?.id,
          avatar_url: '',
        }),
      );

      console.log('Admin has been created');
    }
  }
}
