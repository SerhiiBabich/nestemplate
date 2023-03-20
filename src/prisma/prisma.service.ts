import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(readonly configService: ConfigService) {
		super({
			datasources: {
				db: {
					url: configService.getOrThrow('DATABASE_URL'),
				},
			},
		});
	}

	cleanDb() {
		return this.$transaction([
			this.expense.deleteMany(),
			this.user.deleteMany(),
		]);
	}
}