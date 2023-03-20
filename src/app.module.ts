import { CacheModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';

import { AuthModule } from './auth/auth.module';
import { AdminGuard, SessionGuard } from './auth/guard';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { RedisClientOptions } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AppController } from './app.controller';

@Module({
	imports: [
		SchedulerModule,
		PrismaModule,
		AuthModule,
		UserModule,
		ExpenseModule,
		ScheduleModule.forRoot(),
		CacheModule.registerAsync<RedisClientOptions>({
			isGlobal: true,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				store: redisStore,
				url: configService.getOrThrow('REDIS_URL'),
			}),
		}),
		ConfigModule.forRoot({ isGlobal: true }),
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: SessionGuard,
		},
		{
			provide: APP_GUARD,
			useClass: AdminGuard,
		},
	],
})
export class AppModule {}
