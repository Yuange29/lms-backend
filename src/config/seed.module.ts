import { Role } from 'src/users/entity/role.entity';
import { User } from 'src/users/entity/users.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [SeedService],
})
export class SeedModule {}
