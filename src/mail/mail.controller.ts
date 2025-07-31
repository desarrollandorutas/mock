import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { MailService } from "./mail.service";
import { AuthGuard } from "@nestjs/passport";
import { ContactoMailDto } from "./dto/contac-mail.dto";
import { GetUser } from "src/auth/decorators/get-user.decorator";

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('contact')
    @UseGuards(AuthGuard('jwt'))
    contact(@Body() contactMailDto: ContactoMailDto, @GetUser('email') email: string) {
        contactMailDto.from = email;
        return this.mailService.sendContactMail(contactMailDto);
    }
}