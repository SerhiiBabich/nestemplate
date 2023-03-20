import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Session,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import { PublicRoute } from './decorator';
import { AuthDto } from './dto';
import { UserSession } from './type';

@PublicRoute()
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	async signup(@Body() signUpDto: AuthDto, @Session() session: UserSession) {
		const { id, email, role } = await this.authService.signup(signUpDto);

		this.serializedSession(id, email, role, session);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	async signin(@Body() signUpDto: AuthDto, @Session() session: UserSession) {
		const { id, email, role } = await this.authService.signin(signUpDto);
		this.serializedSession(id, email, role, session);

		return { id, email };
	}

	private serializedSession(
		id: number,
		email: string,
		role: Role,
		session: UserSession,
	) {
		session.user = { id, email, role };
	}
}
