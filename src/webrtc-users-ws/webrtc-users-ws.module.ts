import { Module } from '@nestjs/common';
import { WebrtcUsersWsService } from './webrtc-users-ws.service';
import { WebrtcUsersWsGateway } from './webrtc-users-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [WebrtcUsersWsGateway, WebrtcUsersWsService],
  imports: [AuthModule],
  exports: [WebrtcUsersWsService]
})
export class WebrtcUsersWsModule { }
