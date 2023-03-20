import { Test } from '@nestjs/testing';
import {
	CacheModule,
	CACHE_MANAGER,
	INestApplication,
	ValidationPipe,
} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { ConfigService, ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisClientOptions, RedisClientType } from 'redis';
import { AuthModule } from 'src/auth/auth.module';
import { SessionGuard, AdminGuard } from 'src/auth/guard';
import { ExpenseModule } from 'src/expense/expense.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { UserModule } from 'src/user/user.module';
import * as request from 'supertest';
import { AuthDto } from 'src/auth/dto';

import * as session from 'express-session';
import { createClient } from 'redis';
import * as connectRedis from 'connect-redis';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from 'src/expense/dto';

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let redisClient: RedisClientType;
	let cookie: string;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
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
			controllers: [],
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
		}).compile();

		app = module.createNestApplication();

		const configService = app.get<ConfigService>(ConfigService);

		const RedisStore = connectRedis(session);
		redisClient = createClient({
			url: configService.getOrThrow('REDIS_URL'),
			legacyMode: true,
		});

		const prismaService = app.get<PrismaService>(PrismaService);

		app.use(
			session({
				secret: configService.getOrThrow('SESSION_SECRET'),
				resave: false,
				saveUninitialized: false,
				store: new RedisStore({
					client: redisClient,
				}),
			}),
		);

		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				whitelist: true,
			}),
		);

		await redisClient.connect().catch((error) => {
			throw error;
		});

		await app.init();
		await prismaService.cleanDb();
	});

	afterAll(async () => {
		const cacheManager = app.get(CACHE_MANAGER);
		const cacheClient: RedisClientType = cacheManager.store.getClient();

		await cacheClient.quit();
		await redisClient.disconnect();

		app.close();
	});

	describe('App module', () => {
		it('should be defined', () => {
			expect(app).toBeDefined();
		});
	});

	describe('Auth', () => {
		describe('signup', () => {
			it('should signup', () => {
				const signUpDto: AuthDto = {
					email: 'test04@gmail.com',
					password: '1234',
				};

				return request(app.getHttpServer())
					.post('/auth/signup')
					.send(signUpDto)
					.expect('Set-Cookie', /connect.sid/)
					.expect(201);
			});
		});

		describe('signin', () => {
			it('should signin', () => {
				const signUpDto: AuthDto = {
					email: 'test04@gmail.com',
					password: '1234',
				};

				return request(app.getHttpServer())
					.post('/auth/signin')
					.send(signUpDto)
					.expect('Set-Cookie', /connect.sid/)
					.expect(200)
					.expect(({ headers }) => {
						cookie = headers?.['set-cookie'];
					});
			});
		});

		describe('user', () => {
			describe('me', () => {
				it('should return an user', () => {
					return request(app.getHttpServer())
						.get('/user/me')
						.set('Cookie', cookie)
						.expect(200);
				});
			});
		});
	});

	describe('Expense', () => {
		let expenseId: number;
		it('should create an expenses', async () => {
			const expense1: CreateExpenseDto = {
				title: 'First expense',
				description: 'Description of the first expense',
				amount: '50',
				date: new Date(),
			};
			const expense2: CreateExpenseDto = {
				title: 'Second expense',
				description: 'Description of the second expense',
				amount: '20',
				date: new Date(),
			};

			await request(app.getHttpServer())
				.post('/expense')
				.set('Cookie', cookie)
				.send(expense1)
				.expect(201);

			await request(app.getHttpServer())
				.post('/expense')
				.set('Cookie', cookie)
				.send(expense2)
				.expect(201);
		});

		it('should get all expenses', () => {
			return request(app.getHttpServer())
				.get('/expense')
				.set('Cookie', cookie)
				.expect(200)
				.expect(({ body }) => {
					expect(body.data.length).toBe(2);
					expect(body).toEqual(
						expect.objectContaining({
							data: expect.any(Array),
							count: 2,
							hasMore: false,
						}),
					);

					expenseId = body.data[0].id;
				});
		});

		it('should get one expense by id', async () => {
			await request(app.getHttpServer())
				.get(`/expense/${expenseId}`)
				.set('Cookie', cookie)
				.expect(200)
				.expect(({ body }) => {
					expect(body).toBeTruthy();
				});
		});

		it('should not get one expense by wrong id', async () => {
			await request(app.getHttpServer())
				.get('/expense/0')
				.set('Cookie', cookie)
				.expect(404)
				.expect(({ body }) => {
					expect(body.message).toEqual('Resource does not exist');
				});
		});

		it('should edit expense by id', async () => {
			const dto: UpdateExpenseDto = {
				description: 'Updated description',
			};

			await request(app.getHttpServer())
				.patch(`/expense/${expenseId}`)
				.set('Cookie', cookie)
				.send(dto)
				.expect(200)
				.expect(({ body }) => {
					expect(body.description).toEqual(dto.description);
				});
		});

		it('should delete expense by id', async () => {
			const dto: UpdateExpenseDto = {
				description: 'Updated description',
			};

			await request(app.getHttpServer())
				.delete(`/expense/${expenseId}`)
				.set('Cookie', cookie)
				.expect(204);

			await request(app.getHttpServer())
				.get(`/expense/${expenseId}`)
				.set('Cookie', cookie)
				.expect(404);
		});
	});
});
