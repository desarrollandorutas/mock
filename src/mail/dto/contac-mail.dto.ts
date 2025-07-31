import { IsBoolean, IsOptional, IsString } from "class-validator";

export class ContactoMailDto {

    @IsString()
    subject: string;

    @IsOptional()
    from: string;

    @IsBoolean()
    contact: boolean;

    @IsString()
    message: string;
}