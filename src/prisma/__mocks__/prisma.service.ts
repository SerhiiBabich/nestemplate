import { UserStub, UsersWithExpensesStub } from 'src/user/test/stub';

export const PrismaService = jest.fn().mockReturnValue({
	user: {
		findUnique: jest.fn().mockResolvedValue(UserStub()),
		findMany: jest.fn().mockResolvedValue([UsersWithExpensesStub()]),
	},
});
