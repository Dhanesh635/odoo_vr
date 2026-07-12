import { Body, Controller, Get, Post, SetMetadata } from '@nestjs/common';
import { CurrentUser } from '../../common/auth/current-user.decorator';
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
  me(@CurrentUser() user: { id: string }) {
    return this.usersService.me(user.id);
  }
}
