import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { UserSession } from '../type';

@Injectable()
export class SessionGuard implements CanActivate {
	public constructor(private reflector: Reflector) {}

	public canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublicRoute = this.reflector.getAllAndOverride<string>(
			'PUBLIC_ROUTE',
			[context.getHandler(), context.getClass()],
		);

		if (isPublicRoute) {
			return true;
		}

		const request = context.switchToHttp().getRequest<Request>();
		const session = request.session as UserSession;

		if (!session.user) {
			throw new UnauthorizedException('Session not provided');
		}

		return true;
	}
}
