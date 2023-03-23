import { Injectable } from '@nestjs/common';

@Injectable({})
export class SimpleService {
	public testMe(value: number) {
		return value + 1;
	}

	public testMeWithMocks(value: number) {
		const randomValue = this.genRandom();

		return value + randomValue;
	}

	public genRandom() {
		return Math.round(Math.random() * 100);
	}
}
