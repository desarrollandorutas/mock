import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { RtcRole, RtcTokenBuilder } from 'agora-token';
import { envs } from 'src/config/env';
import { AuthService } from '../auth/auth.service';
import { UserSuscription } from '@prisma/client';
import * as UsesCase from '../core/use-cases';
import { agoraIoFetcher } from 'src/config/adapters/agora-io.adapter';
import { WebrtcUsersWsService } from '../webrtc-users-ws/webrtc-users-ws.service';

@Injectable()
export class WebrtcService {
    async channelExist(name: string) {
        const channelExist = await UsesCase.getExistChannelUseCase(agoraIoFetcher, name);
        return {
            channelExist
        }
    }

    constructor(
        private readonly authService: AuthService,
        private readonly wsService: WebrtcUsersWsService,
    ) { }

    async generateToken(createRoomDto: CreateRoomDto, id: string) {
        const user = await this.authService.findUserById(id);

        const alreadyConnected = this.wsService.userAlreadyConnected(id);

        if (alreadyConnected) throw new BadRequestException('ALREADY_CONNECTED');

        const token = RtcTokenBuilder.buildTokenWithUid(
            envs.agoraAppId,
            envs.agoraAppCertificate,
            createRoomDto.channelName,
            createRoomDto.uid,
            RtcRole.PUBLISHER,
            user.suscription === UserSuscription.PREMIUM ? envs.agoraTokenExpPremium : envs.agoraTokenExpFree,
            user.suscription === UserSuscription.PREMIUM ? envs.agoraTokenExpPremium : envs.agoraTokenExpFree,
        );

        return {
            token,
            channelName: createRoomDto.channelName
        }

    }
}
