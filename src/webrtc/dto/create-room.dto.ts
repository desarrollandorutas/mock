import { IsNumber, IsString } from "class-validator";

export class CreateRoomDto {
    @IsString()
    channelName: string;

    @IsNumber()
    uid: number;
}