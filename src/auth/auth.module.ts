import { Role } from 'src/role/entity/role.entity';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, ConfigService, JwtService],
})
export class AuthModule {}
