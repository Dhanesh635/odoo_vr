import { Body, Controller, Get, Post, Req, SetMetadata } from '@nestjs/common';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../common/auth/auth.constants';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SetMetadata(IS_PUBLIC_KEY, true)
  @Post('register')
  register(@Body() body: unknown) {
    return this.usersService.register(body);
  }

  @SetMetadata(IS_PUBLIC_KEY, true)
  @Post('login')
  login(@Body() body: unknown) {
    return this.usersService.login(body);
  }

  @Get('me')
  me(@Req() request: Request & { user?: { sub: string } }) {
    return this.usersService.me(request.user?.sub ?? '');
  }
}
