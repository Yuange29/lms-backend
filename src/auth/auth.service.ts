import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { SignInDataDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUpInfo(createReq: CreateUserDto) {
    return await this.userService.createUser(createReq);
  }

  async signIn(signInReq: SignInDataDto) {
    const user = await this.userRepository.findOne({
      where: { email: signInReq.email },
    });
    if (!user)
      throw new UnauthorizedException('Email or Password is not valid');

    const isMatch = bcrypt.compare(signInReq.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Email or Password is not valid');

    const tokens = await this.generateToken(user);
    if (!tokens) throw new ConflictException('Can not generate tokens');

    const hashRefresh = await bcrypt.hash(tokens.refreshToken, 10);

    this.userRepository.update(user.id, { refresh_token: hashRefresh });

    return tokens;
  }

  async refresh(id: string, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user || !refreshToken)
      throw new UnauthorizedException('Access denied');

    const isMatch = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!isMatch) throw new UnauthorizedException('Unauthentication');

    const tokens = await this.generateToken(user);
    if (!tokens) throw new ConflictException('Can not generate tokens');

    const hashRefresh = await bcrypt.hash(tokens.refreshToken, 10);

    this.userRepository.update(user.id, { refresh_token: hashRefresh });

    return tokens;
  }

  async logoutToken(id: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) throw new UnauthorizedException('Access denied');

    this.userRepository.update(user.id, { refresh_token: '' });

    return {
      success: true,
    };
  }

  getMe(user: User) {
    return user;
  }

  private async generateToken(user: User) {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('ACCESS_SECRET'),
        expiresIn: this.configService.get('ACCESS_EXP'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_SECRET'),
        expiresIn: this.configService.get('REFRESH_EXP'),
      }),
    ]);
    return { accessToken, refreshToken };
  }
}

// PATCH  /auth/change-password   --> đổi mật khẩu
