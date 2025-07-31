import { IsEmail, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString({ message: 'REQ_NAME' })
    @MinLength(3, { message: 'INVALID_USER_NAME' })
    name: string;

    @IsEmail({}, {
        message: 'INVALID_MAIL'
    })
    @IsOptional()
    email: string;

    @IsStrongPassword({}, {
        message: 'INVALID_PASSWORD_FORMAT'
    })
    @IsOptional()
    password: string;
}