import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { MailModule } from './mail/mail.module';
import { WebrtcModule } from './webrtc/webrtc.module';
import { WebrtcUsersWsModule } from './webrtc-users-ws/webrtc-users-ws.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentsModule } from './payments/payments.module';
import { ClienteTbkModule } from './cliente-tbk/cliente-tbk.module';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, FilesModule, MailModule, WebrtcModule, WebrtcUsersWsModule, CronModule, PaymentsModule, ClienteTbkModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
