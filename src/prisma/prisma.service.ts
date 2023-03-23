import { INestApplication } from '@nestjs/common';
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

	async onModuleInit() {
		await this.$connect();
	}

	async enableShutdownHooks(app: INestApplication) {
		this.$on('beforeExit', async () => {
			await app.close();
		});
	}

	cleanDb() {
		return this.$transaction([
			this.expense.deleteMany(),
			this.user.deleteMany(),
		]);
	}
}
