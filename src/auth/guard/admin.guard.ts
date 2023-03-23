import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { UserSession } from '../type';

@Injectable()
export class AdminGuard implements CanActivate {
	public constructor(private reflector: Reflector) {}

	public canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublicRoute = this.reflector.getAllAndOverride<string>(
			'ONLY_ADMIN',
			[context.getHandler(), context.getClass()],
		);

		if (!isPublicRoute) {
			return true;
		}

		const request = context.switchToHttp().getRequest<Request>();
		const session = request.session as UserSession;

		if (session.user.role !== Role.ADMIN) {
			throw new UnauthorizedException('Reserved for admins');
		}

		return true;
	}
}
