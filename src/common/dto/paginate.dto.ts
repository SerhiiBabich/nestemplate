import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';

export class PaginateDto {
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@Max(20)
	public readonly limit = 20;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@Max(1000)
	public readonly offset = 0;
}
