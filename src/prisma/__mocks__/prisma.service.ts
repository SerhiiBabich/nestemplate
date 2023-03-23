import { userStub, usersWithExpensesStub } from 'src/user/test/stub';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PrismaService = jest.fn().mockReturnValue({
	user: {
		findUnique: jest.fn().mockResolvedValue(userStub()),
		findMany: jest.fn().mockResolvedValue([usersWithExpensesStub()]),
	},
});
