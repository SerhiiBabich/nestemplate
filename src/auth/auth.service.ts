import { ForbiddenException, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthDto } from './dto';

@Injectable()
export class AuthService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async signup(signUpDto: AuthDto) {
		const userExists = await this.prismaService.user.findUnique({
			where: {
				email: signUpDto.email,
			},
		});

		if (userExists) {
			throw new ForbiddenException('User is exists');
		}

		const hashedPassword = await hash(signUpDto.password);
		const user = await this.prismaService.user.create({
			data: {
				email: signUpDto.email,
				password: hashedPassword,
			},
		});

		return { id: user.id, email: user.email, role: user.role };
	}

	public async signin(signUpDto: AuthDto) {
		const userFound = await this.prismaService.user.findUnique({
			where: { email: signUpDto.email },
		});

		if (!userFound) {
			throw new ForbiddenException('Credentials is not correct');
		}

		const passwordMatches = await verify(
			userFound.password,
			signUpDto.password,
		);

		if (!passwordMatches) {
			throw new ForbiddenException('Password incorrect');
		}

		return { id: userFound.id, email: userFound.email, role: userFound.role };
	}
}
