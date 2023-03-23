import { Test } from '@nestjs/testing';

import { SimpleService } from '../simple.service';

describe('SimpleService', () => {
	let simpleService: SimpleService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [SimpleService],
		}).compile();

		simpleService = module.get<SimpleService>(SimpleService);
	});

	it('bootstrap', () => {
		expect(simpleService).toBeDefined();
	});

	describe('testMe()', () => {
		let result;

		beforeEach(() => {
			result = simpleService.testMe(5);
		});

		it('should return a number', () => {
			expect(typeof result).toBe('number');
		});

		it('should return a value + 1', () => {
			expect(result).toBe(6);
		});
	});

	describe('testMeWithMocks()', () => {
		let result;

		beforeEach(() => {
			// Math.random = jest.fn().mockReturnValue(0.02);
			jest.spyOn(simpleService, 'genRandom').mockReturnValue(2);
			result = simpleService.testMeWithMocks(5);
		});

		afterAll(() => {
			jest.restoreAllMocks();
		});

		it('getRandom()', () => {
			expect(simpleService.genRandom).toHaveBeenCalled();
			expect(simpleService.genRandom).toHaveReturnedWith(2);
		});

		it('should return a number', () => {
			expect(typeof result).toBe('number');
		});

		it('should return a value + 2', () => {
			expect(result).toBe(7);
		});
	});
});
