/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/entities';
import { URole } from 'src/enum';

export const IsAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();

    const user: User = request.user;

    if (user && user.role == URole.ADMIN) {
      return true;
    } else {
      return false;
    }
  },
);
