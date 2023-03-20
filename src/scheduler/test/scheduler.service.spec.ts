import { Test } from '@nestjs/testing';
import { UsersWithExpensesStub } from 'src/user/test/stub';
import { PrismaService } from '../../prisma/prisma.service';
import { SchedulerService } from '../scheduler.service';

jest.mock('../../prisma/prisma.service');

describe('SchedulerService', () => {
	let schedulerService: SchedulerService;
	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [SchedulerService, PrismaService],
		}).compile();

		schedulerService = module.get<SchedulerService>(SchedulerService);
	});

	it('bootstrap', () => {
		expect(schedulerService).toBeDefined();
	});

	describe('getExpensesSum()', () => {
		let result;
		beforeEach(() => {
			result = schedulerService.getExpensesSum(
				UsersWithExpensesStub()[0].expenses,
			);
		});

		it('should return the sum', () => {
			expect(result).toBe(170);
		});
	});
});
