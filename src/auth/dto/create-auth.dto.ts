import { IsEmail, Length } from "class-validator";

export class CreateAuthDto {
    @Length(5)
    username: string;

    @Length(8)
    password: string;

    @Length(8)
    password_confirm: string;

    @Length(2)
    firstName: string;

    @Length(2)
    lastName: string;

    @IsEmail()
    email: string;
}
