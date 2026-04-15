import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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

import { GetUser } from '../common/decorators/current-user.decorator';
import { JwtAccessGuard } from '../common/guards/jwt-access.guard';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import { SignInDataDto } from './dto/signin.dto';

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
  async myInfo(@GetUser('id') id: string) {
    return { user: await this.authService.getMe(id) };
  }

  @UseGuards(JwtAccessGuard)
  @Post('signout')
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as { sub: string };
    res.clearCookie('refreshToken');

    return await this.authService.logoutToken(user.sub);
  }
}

// PATCH  /auth/change-password   --> đổi mật khẩu
