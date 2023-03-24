import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { UserSession } from '../type';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GetUserId = createParamDecorator(
	(data: undefined, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>();
		const session = request.session as UserSession;

		return Number(session.user.id);
	},
);
