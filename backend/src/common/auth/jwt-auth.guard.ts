import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AUTH_SECRET_ENV_KEY, IS_PUBLIC_KEY } from './auth.constants';
import { AuthUser } from './auth-user.interface.js';
import { TokenService } from './token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    const token = this.getBearerToken(request);

    request.user = this.tokenService.verify(
      token,
      process.env[AUTH_SECRET_ENV_KEY] ?? 'development-secret',
    );

    return true;
  }

  private getBearerToken(request: Request): string {
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    return header.slice(7).trim();
  }
}
