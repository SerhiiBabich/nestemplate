import { Role } from '@prisma/client';
import { Session } from 'express-session';

export interface UserSessionData {
	id: number;
	email: string;
	role: Role;
}

export type UserSession = Session & Record<'user', UserSessionData>;
