import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class VerifyPasswordOTP {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(4)
    otp: string;
}