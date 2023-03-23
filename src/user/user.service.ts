import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

	public getAllUsers() {
		return this.prismaService.user.findMany({
			select: {
				id: true,
				firstName: true,
				lastName: true,
				createdAt: true,
				_count: {
					select: {
						expenses: true,
					},
				},
			},
		});
	}

	public async getMe(id: number) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
		});

		delete user.password;

		return user;
	}
}
