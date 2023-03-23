import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
	@IsString()
	public readonly title: string;

	@IsString()
	@IsOptional()
	public readonly description?: string;

	@IsString()
	public readonly amount: string;

	@IsDateString()
	public readonly date: Date;
}
