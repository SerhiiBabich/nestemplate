import { Controller, Get } from '@nestjs/common';
import { name, version } from 'package.json';
import { publicRoute } from 'src/auth/decorator';

@publicRoute()
@Controller()
export class AppController {
	@Get('/status')
	public status() {
		return {
			name,
			version,
			date: new Date(),
		};
	}
}
