import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { NewUserDto } from './dto/new-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class WebrtcUsersWsService {

    private connectedUsers: Record<string, NewUserDto[]> = {};

    constructor(
        private readonly authService: AuthService
    ) { }

    async registerCliente(client: Socket, payload: NewUserDto, userId: string) {

        if (!this.connectedUsers[payload.channelName]) {
            this.connectedUsers[payload.channelName] = [];
        }

        payload.user = await this.authService.findUserById(userId);
        this.checkUserConnection(payload.channelName, userId);

        this.connectedUsers[payload.channelName].push({
            uid: payload.uid,
            user: payload.user,
            socket: {
                id: client.id,
                disconnect: client.disconnect.bind(client)
            },
            channelName: payload.channelName,
            mute: false
        });

        client.data.uid = payload.uid;
        client.join(payload.channelName);
    }

    async userUnmute(client: Socket, payload: NewUserDto, userId: string) {
        const channelUsers = this.connectedUsers[payload.channelName];
        if (channelUsers) {
            const user = channelUsers.find(u => u.user.id === userId);
            console.log('userUnmute', user.user.name, userId);

            if (user) user.mute = false;
        }

    }

    async userMute(client: Socket, payload: NewUserDto, userId: string) {
        const channelUsers = this.connectedUsers[payload.channelName];
        if (channelUsers) {
            const user = channelUsers.find(u => u.user.id === userId);
            console.log('userMute', user.user.name, userId);
            if (user) user.mute = true;
        }
    }

    async unregisterClient(client: Socket, payload: NewUserDto) {
        this.connectedUsers[payload.channelName] = this.connectedUsers[payload.channelName].filter(
            (user) => user.uid !== payload.uid
        );
        client.leave(payload.channelName);
    }


    getConnectedClients() {
        return this.connectedUsers;
    }

    private checkUserConnection(channelName: string, userId: string) {
        const connectedClient = this.connectedUsers[channelName].find(user => user.user.id === userId);
        if (connectedClient) connectedClient.socket.disconnect();
    }

    userAlreadyConnected(userId: string) {
        const connected = Object.values(this.connectedUsers).find(users => users.find(user => user.user.id === userId));
        return !!connected;
    }

}
