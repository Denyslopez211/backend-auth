import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

import { MESSAGE } from '../constants';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user) throw new InternalServerErrorException(MESSAGE.userNoFound);

  return user;
});
