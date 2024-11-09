import {
    IsString,
    IsNotEmpty,
    Length,
    IsEmail
} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly username: string;
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @Length(5, 25)
    readonly password: string;
    @IsNotEmpty()
    readonly age: number;
    @IsString()
    @IsNotEmpty()
    readonly location: string;
}
