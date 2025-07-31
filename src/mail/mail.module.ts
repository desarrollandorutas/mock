import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
    imports: [AuthModule]
})
export class MailModule { }