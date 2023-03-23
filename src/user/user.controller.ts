import { Controller, Get } from '@nestjs/common';
import { getUserId, onlyAdmin } from 'src/auth/decorator';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
	public constructor(private readonly userService: UserService) {}

	@onlyAdmin()
	@Get('all')
	public getAllUsers() {
		return this.userService.getAllUsers();
	}

	@Get('me')
	public getMe(@getUserId() userId: number) {
		return this.userService.getMe(userId);
	}
}
