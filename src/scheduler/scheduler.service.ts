import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Expense } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class SchedulerService {
	private readonly logger = new Logger(SchedulerService.name);

	constructor(private readonly prismaService: PrismaService) {}

	@Cron(CronExpression.EVERY_5_SECONDS)
	async computeBalances() {
		const users = await this.prismaService.user.findMany({
			include: { expenses: true },
		});

		for (const user of users) {
			const sum = this.getExpensesSum(user.expenses);
			if (user.initialBalance - sum >= user.currentBalance) {
				continue;
			}

			await this.prismaService.user
				.update({
					where: {
						id: user.id,
					},
					data: { currentBalance: user.initialBalance - sum },
				})
				.catch((error) => {
					console.log('___', error);
				});

			this.logger.debug('start computeBalances()');
		}
	}

	getExpensesSum(expenses: Expense[]) {
		return expenses.reduce((prev: number, next: Expense) => {
			return prev + Number(next.amount);
		}, 0);
	}
}
