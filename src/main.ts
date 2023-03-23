import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { createClient } from 'redis';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	const configService = app.get(ConfigService);

	const redisStore = connectRedis(session);
	const redisClient = createClient({
		url: configService.getOrThrow('REDIS_URL'),
		legacyMode: true,
	});

	app.use(
		session({
			secret: configService.getOrThrow('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false,
			store: new redisStore({
				client: redisClient,
			}),
		}),
	);

	await redisClient.connect().catch((error) => {
		throw error;
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			forbidUnknownValues: true, // https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-18413
		}),
	);

	// logs.
	app.useLogger(app.get(Logger));
	app.useGlobalInterceptors(new LoggerErrorInterceptor());

	const prismaService = app.get(PrismaService);

	prismaService.enableShutdownHooks(app);

	await app.listen(1111);
}
void bootstrap();
