import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entity/users.entity';

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { GetUser } from './decorators/CurrentUser.decorator';
import { SignInDataDto } from './dto/signin.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signupAccount(@Body() request: CreateUserDto) {
    return this.authService.signUpInfo(request);
  }

  @Post('signin')
  async signinAccount(
    @Body() request: SignInDataDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(request);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000,
    });
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh = req.cookies['refreshToken'];
    if (!refresh) throw new UnauthorizedException('Refresh Not Found');

    const user = req.user as { sub: string };

    const tokens = await this.authService.refresh(user.sub, refresh);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  myInfo(@GetUser() user: User) {
    return user;
  }
}
// POST   /auth/signup            --> đăng ký
// POST   /auth/signin            --> đăng nhập
// POST   /auth/signout           --> đăng xuất
// POST   /auth/refresh           --> refresh access token
// GET    /auth/me                --> lấy info user hiện tại
// PATCH  /auth/change-password   --> đổi mật khẩu
