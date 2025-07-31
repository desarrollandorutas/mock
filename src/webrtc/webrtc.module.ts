import { Module } from '@nestjs/common';
import { WebrtcService } from './webrtc.service';
import { WebrtcController } from './webrtc.controller';
import { AuthModule } from 'src/auth/auth.module';
import { WebrtcUsersWsModule } from 'src/webrtc-users-ws/webrtc-users-ws.module';

@Module({
  controllers: [WebrtcController],
  providers: [WebrtcService],
  imports: [AuthModule, WebrtcUsersWsModule]
})
export class WebrtcModule { }
