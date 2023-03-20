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
	constructor(private readonly expenseService: ExpenseService) {}

	@UseInterceptors(CacheInterceptor)
	@CacheTTL(5)
	@Get()
	getAllUserExpenses(
		@GetUserId() userId: number,
		@Query() paginate: PaginateDto,
	) {
		return this.expenseService.getAllUserExpenses(userId, paginate);
	}

	@Get(':id')
	getAllUserExpenseById(
		@GetUserId() userId: number,
		@Param('id') expenseId: number,
	) {
		return this.expenseService.getAllUserExpenseById(userId, expenseId);
	}

	@Post()
	createExpense(
		@GetUserId() userId: number,
		@Body() createExpenseDto: CreateExpenseDto,
	) {
		return this.expenseService.createExpense(userId, createExpenseDto);
	}

	@Patch(':id')
	updateExpenseById(
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
	deleteExpenseById(
		@GetUserId() userId: number,
		@Param('id') expenseId: number,
	) {
		return this.expenseService.deleteExpenseById(userId, expenseId);
	}
}
