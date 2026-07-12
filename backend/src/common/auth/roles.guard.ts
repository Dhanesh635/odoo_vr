import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  AUTH_SECRET_ENV_KEY,
  IS_PUBLIC_KEY,
  ROLES_KEY,
} from './auth.constants';
import { AuthUser } from './auth-user.interface.js';
import { TokenService } from './token.service';

@Injectable()
export class RolesGuard implements CanActivate {
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

    const allowedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    const user = request.user ?? this.authenticateFromHeader(request);

    if (!allowedRoles?.length) {
      request.user = user;
      return true;
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    request.user = user;

    return true;
  }

  private authenticateFromHeader(request: Request): AuthUser {
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    return this.tokenService.verify(
      header.slice(7).trim(),
      process.env[AUTH_SECRET_ENV_KEY] ?? 'development-secret',
    );
  }
}
