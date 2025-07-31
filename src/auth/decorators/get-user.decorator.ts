import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        if (!req.user) throw new InternalServerErrorException('USER_NOT_AUTHENTICATED')
        return (!data) ? req.user : req.user[data];
    }
);