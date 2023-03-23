import { CacheModule, Module } from '@nestjs/common';
import { CacheStore } from '@nestjs/common/cache/interfaces/cache-manager.interface';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import { LoggerModule } from 'nestjs-pino';
import { RedisClientOptions } from 'redis';
import { ExpenseModule } from './expense/expense.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { UserModule } from './user/user.module';

import { PinoLoggerParams } from '../config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AdminGuard, SessionGuard } from './auth/guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		LoggerModule.forRoot(PinoLoggerParams),
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
				store: redisStore as CacheStore,
				url: configService.getOrThrow<string>('REDIS_URL'),
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
