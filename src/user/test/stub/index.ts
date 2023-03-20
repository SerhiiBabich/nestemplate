import { Expense, Role } from '@prisma/client';
const date = new Date();

export const UserStub = () => ({
	id: 1,
	email: 'serhii@test.com',
	firstName: null,
	lastName: null,
	role: Role.USER,

	initialBalance: 2000,
	currentBalance: 2000,

	createdAt: date,
	updatedAt: date,
});

export const UsersWithExpensesStub = () => [
	{
		id: 1,
		email: 'serhii@test.com',
		firstName: null,
		lastName: null,
		role: Role.USER,

		initialBalance: 2000,
		currentBalance: 2000,

		createdAt: date,
		updatedAt: date,
		expenses: [
			{ id: 1, amount: '100' },
			{ id: 2, amount: '20' },
			{ id: 3, amount: '50' },
		] as Expense[],
	},
];
