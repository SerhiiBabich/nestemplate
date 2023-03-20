import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PaginateDto, PaginateResultDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

@Injectable()
export class ExpenseService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAllUserExpenses(
		userId: number,
		paginate: PaginateDto,
	): Promise<PaginateResultDto> {
		const expenses = await this.prismaService.expense.findMany({
			where: {
				userId,
			},
			take: paginate.limit,
			skip: paginate.offset,
		});

		const count = await this.prismaService.expense.count({
			where: {
				userId,
			},
		});

		return {
			data: expenses,
			count,
			hasMore: count > paginate.limit + paginate.offset,
		};
	}

	async getAllUserExpenseById(userId: number, expenseId: number) {
		const expense = await this.prismaService.expense.findFirst({
			where: {
				id: expenseId,
			},
			include: {
				user: {
					select: {
						email: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		});

		if (!expense) {
			throw new NotFoundException('Resource does not exist');
		}

		if (expense.userId !== userId) {
			throw new ForbiddenException('Access to resource unauthorized');
		}

		return expense;
	}

	async createExpense(userId: number, createExpenseDto: CreateExpenseDto) {
		const newExpense = await this.prismaService.expense.create({
			data: {
				...createExpenseDto,
				userId,
			},
		});

		return newExpense;
	}
	async updateExpenseById(
		userId: number,
		expenseId: number,
		updateExpenseDto: UpdateExpenseDto,
	) {
		const expense = await this.prismaService.expense.findFirst({
			where: {
				id: expenseId,
			},
		});

		if (!expense) {
			throw new NotFoundException('Resource does not exist');
		}

		if (expense.userId !== userId) {
			throw new ForbiddenException('Access to resource unauthorized');
		}

		const updatedExpense = this.prismaService.expense.update({
			where: {
				id: expenseId,
			},
			data: updateExpenseDto,
		});

		return updatedExpense;
	}

	async deleteExpenseById(userId: number, expenseId: number) {
		const expense = await this.prismaService.expense.findFirst({
			where: {
				id: expenseId,
			},
			include: {
				user: {
					select: {
						email: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		});

		if (!expense) {
			throw new NotFoundException('Resource does not exist');
		}

		if (expense.userId !== userId) {
			throw new ForbiddenException('Access to resource unauthorized');
		}

		return this.prismaService.expense.delete({
			where: {
				id: expenseId,
			},
		});
	}
}
