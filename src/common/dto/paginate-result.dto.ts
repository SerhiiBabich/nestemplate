export class PaginateResultDto {
	public readonly data: Record<string, any>[];
	public readonly count: number;
	public readonly hasMore: boolean;
}
