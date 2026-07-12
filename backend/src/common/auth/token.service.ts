import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

export interface AuthTokenPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class TokenService {
  sign(payload: AuthTokenPayload, secret: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = this.encodeJson(header);
    const encodedPayload = this.encodeJson({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
    });
    const message = `${encodedHeader}.${encodedPayload}`;
    const signature = createHmac('sha256', secret)
      .update(message)
      .digest('base64url');

    return `${message}.${signature}`;
  }

  verify(token: string, secret: string): AuthTokenPayload {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new Error('Invalid token format');
    }

    const message = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = createHmac('sha256', secret)
      .update(message)
      .digest('base64url');

    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as AuthTokenPayload;

    if (!payload.id || !payload.email || !payload.role) {
      throw new Error('Invalid token payload');
    }

    return payload;
  }

  private encodeJson(value: unknown): string {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
  }
}
