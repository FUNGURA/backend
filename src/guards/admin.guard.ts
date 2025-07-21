import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || !roles.includes('ADMIN')) {
      throw new UnauthorizedException(
        'You must have ADMIN role to access this route',
      );
    }

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token is required');
    }

    const token = authorization.split(' ')[1];

    try {
      const decoded: any = verify(token, process.env.JWT_SECRET);

      if (!decoded || decoded.role !== 'ADMIN') {
        throw new UnauthorizedException(
          'You must have ADMIN role to access this route',
        );
      }

      request.user = decoded;
      return true;
    } catch (error) {
      console.error('The error is : ' + error);
      throw new UnauthorizedException('Invalid token or role');
    }
  }
}
