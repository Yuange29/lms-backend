import { Role } from 'src/role/entity/role.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
