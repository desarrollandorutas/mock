import { UserStatus, UserSuscription } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";
import { UserStatusList } from "../enum/user-status.enum";
import { UserSuscriptionList } from "../enum/user-suscription.enum";

export class RegisterUserDto {

    @IsString({ message: 'REQ_NAME' })
    @MinLength(3, { message: 'INVALID_USER_NAME' })
    name: string;

    @IsString({
        message: `REQ_EMAIL.`
    })
    @IsEmail({}, {
        message: 'INVALID_MAIL'
    })
    email: string;

    @IsString({ message: 'REQ_PASSWORD' })
    @IsStrongPassword({}, {
        message: 'INVALID_PASSWORD_FORMAT'
    })
    password: string;

    @IsOptional()
    avatar: string = '';

    @IsEnum(UserStatusList, {
        message: `REQ_STATUS`
    })
    @IsOptional()
    status: UserStatus = UserStatus.PENDING;

    @IsEnum(UserSuscriptionList, {
        message: `REQ_SUBSCRIPTION`
    })
    @IsOptional()
    suscription: UserSuscription = UserSuscription.FREE;
}