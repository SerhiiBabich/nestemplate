import { Controller, Get } from '@nestjs/common';
import { name, version } from 'package.json';
import { PublicRoute } from 'src/auth/decorator';

@PublicRoute()
@Controller()
export class AppController {
	@Get('/status')
	status() {
		return {
			name,
			version,
			date: new Date(),
		};
	}
}
