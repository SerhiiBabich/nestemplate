import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
	@IsEmail()
	public readonly email: string;

	@IsString()
	@MinLength(4)
	public readonly password: string;
}
