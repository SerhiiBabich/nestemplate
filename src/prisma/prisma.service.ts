import { INestApplication } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
	public constructor(configService: ConfigService) {
		super({
			datasources: {
				db: {
					url: configService.getOrThrow('DATABASE_URL'),
				},
			},
		});
	}

	public async onModuleInit() {
		await this.$connect();
	}

	public enableShutdownHooks(app: INestApplication) {
		this.$on('beforeExit', async (): Promise<void> => {
			await app.close();
		});
	}

	public cleanDb() {
		return this.$transaction([
			this.expense.deleteMany(),
			this.user.deleteMany(),
		]);
	}
}
