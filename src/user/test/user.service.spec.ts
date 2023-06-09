import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user.service';
import { userStub } from './stub';

jest.mock('../../prisma/prisma.service');

describe('UserService', () => {
	let userService: UserService;
	let prismaService: PrismaService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [ConfigModule.forRoot()],
			providers: [UserService, PrismaService],
		}).compile();

		userService = module.get<UserService>(UserService);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	it('bootstrap', () => {
		expect(userService).toBeDefined();
	});

	describe('getMe()', () => {
		let user: User;

		beforeEach(async () => {
			user = await userService.getMe(userStub().id);
		});

		test('findUnique() should be called', () => {
			expect(prismaService.user.findUnique).toHaveBeenCalledWith({
				where: {
					id: userStub().id,
				},
			});

			expect(prismaService.user.findUnique).toHaveReturnedWith(
				Promise.resolve(userStub()),
			);
		});

		it('should return user', () => {
			const _user = userStub();

			expect(user).toMatchObject(_user);
		});
	});
});
