import {
	Body,
	CacheInterceptor,
	CacheTTL,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseInterceptors,
} from '@nestjs/common';
import { GetUserId } from 'src/auth/decorator';
import { PaginateDto } from 'src/common/dto';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
	public constructor(private readonly expenseService: ExpenseService) {}

	@UseInterceptors(CacheInterceptor)
	@CacheTTL(5)
	@Get()
	public getAllUserExpenses(
		@GetUserId() userId: number,
		@Query() paginate: PaginateDto,
	) {
		return this.expenseService.getAllUserExpenses(userId, paginate);
	}

	@Get(':id')
	public getAllUserExpenseById(
		@GetUserId() userId: number,
		@Param('id') expenseId: number,
	) {
		return this.expenseService.getAllUserExpenseById(userId, expenseId);
	}

	@Post()
	public createExpense(
		@GetUserId() userId: number,
		@Body() createExpenseDto: CreateExpenseDto,
	) {
		return this.expenseService.createExpense(userId, createExpenseDto);
	}

	@Patch(':id')
	public updateExpenseById(
		@GetUserId() userId: number,
		@Param('id') expenseId: number,
		@Body() updateExpenseDto: UpdateExpenseDto,
	) {
		return this.expenseService.updateExpenseById(
			userId,
			expenseId,
			updateExpenseDto,
		);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	public deleteExpenseById(
		@GetUserId() userId: number,
		@Param('id') expenseId: number,
	) {
		return this.expenseService.deleteExpenseById(userId, expenseId);
	}
}
