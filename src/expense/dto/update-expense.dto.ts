import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateExpenseDto {
	@IsString()
	@IsOptional()
	public readonly title?: string;

	@IsString()
	@IsOptional()
	public readonly description?: string;

	@IsString()
	@IsOptional()
	public readonly amount?: string;

	@IsDateString()
	@IsOptional()
	public readonly date?: Date;
}
