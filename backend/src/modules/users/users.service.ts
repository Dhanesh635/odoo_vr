import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, createHmac } from 'crypto';
import { z } from 'zod';
import { UserRole } from '../../schemas';
import { User } from '../../schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private readonly registerSchema = z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
    password: z.string().min(6),
    role: z.nativeEnum(UserRole),
    isActive: z.boolean().optional(),
  });

  private readonly loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  });

  async register(input: unknown) {
    const data = this.registerSchema.parse(input);
    const existing = await this.usersRepository.findByEmail(data.email);

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersRepository.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: this.hashPassword(data.password),
      role: data.role,
      isActive: data.isActive ?? true,
    });

    return this.buildAuthResponse(user);
  }

  async login(input: unknown) {
    const data = this.loginSchema.parse(input);
    const user = await this.usersRepository.findByEmailWithPassword(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.passwordHash !== this.hashPassword(data.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async me(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  private buildAuthResponse(user: User) {
    const sanitizedUser = this.sanitizeUser(user);
    const token = this.signAuthToken({
      sub: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return { user: sanitizedUser, token };
  }

  private sanitizeUser(user: User) {
    const documentLike = user as User & {
      toObject?: () => Record<string, unknown>;
    };

    if (typeof documentLike.toObject === 'function') {
      const plainUser = documentLike.toObject() as Record<string, unknown> & {
        passwordHash?: string;
      };
      delete plainUser.passwordHash;
      return plainUser;
    }

    const plainUser = {
      ...(user as unknown as Record<string, unknown>),
    } as Record<string, unknown> & {
      passwordHash?: string;
    };
    delete plainUser.passwordHash;
    return plainUser;
  }

  private hashPassword(password: string) {
    return createHash('sha256').update(password).digest('hex');
  }

  private signAuthToken(payload: {
    sub: string;
    name: string;
    email: string;
    role: UserRole;
  }) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      'base64url',
    );
    const encodedPayload = Buffer.from(
      JSON.stringify({
        ...payload,
        iat: Math.floor(Date.now() / 1000),
      }),
    ).toString('base64url');
    const secret = process.env.JWT_SECRET ?? 'development-secret';
    const signature = createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
}
