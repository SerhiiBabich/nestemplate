import { Controller, Get } from '@nestjs/common';
import { GetUserId, OnlyAdmin } from 'src/auth/decorator';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
	public constructor(private readonly userService: UserService) {}

	@OnlyAdmin()
	@Get('all')
	public getAllUsers() {
		return this.userService.getAllUsers();
	}

	@Get('me')
	public getMe(@GetUserId() userId: number) {
		return this.userService.getMe(userId);
	}
}
