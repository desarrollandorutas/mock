import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebrtcUsersWsService } from './webrtc-users-ws.service';
import { Server, Socket } from 'socket.io';
import { NewUserDto } from './dto/new-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class WebrtcUsersWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  constructor(
    private readonly webrtcUsersWsService: WebrtcUsersWsService,
    private readonly jwtService: JwtService,
  ) { }



  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);

    const token = client.handshake.headers.authorization;
    try {
      this.jwtService.verify(token);
    } catch (error) {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);

    // Remover al usuario de la lista de su sala
    for (const channel in this.webrtcUsersWsService.getConnectedClients()) {
      this.webrtcUsersWsService.getConnectedClients()[channel] = this.webrtcUsersWsService.getConnectedClients()[channel].filter(
        (user) => user.uid !== client.data.uid
      );
    }

    // Notificar solo a los usuarios en la sala específica
    for (const channel in this.webrtcUsersWsService.getConnectedClients()) {
      this.server.to(channel).emit('updateUserList', this.webrtcUsersWsService.getConnectedClients()[channel]);
    }
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, payload: NewUserDto) {

    const token = client.handshake.headers.authorization;
    let payloadJwt: JwtPayload;
    payload.uid = client.id;

    try {
      // payload.socket = client;
      payloadJwt = this.jwtService.verify(token);
      await this.webrtcUsersWsService.registerCliente(client, payload, payloadJwt.id);
    } catch (error) {
      console.log({ error });

      client.disconnect();
      return;
    }


    // Si el canal no existe en la lista, inicializarlo
    // if (!this.connectedUsers[channelName]) {
    //   this.connectedUsers[channelName] = [];
    // }

    // Agregar al usuario a la sala/canal correspondiente
    // this.connectedUsers[channelName].push({ uid, channelName, user });


    // Notificar solo a los usuarios de la sala
    // this.server.to(channelName).emit('updateUserList', this.connectedUsers[channelName]);
    this.server.to(payload.channelName).emit('updateUserList', this.webrtcUsersWsService.getConnectedClients()[payload.channelName]);
  }

  @SubscribeMessage('userMute')
  async userMute(client: Socket, payload: NewUserDto) {
    const token = client.handshake.headers.authorization;
    let payloadJwt: JwtPayload;
    payload.uid = client.id;

    try {
      // payload.socket = client;
      payloadJwt = this.jwtService.verify(token);
      await this.webrtcUsersWsService.userMute(client, payload, payloadJwt.id);
    } catch (error) {
      console.log({ error });

      client.disconnect();
      return;
    }

    this.server.to(payload.channelName).emit('updateUserList', this.webrtcUsersWsService.getConnectedClients()[payload.channelName]);
  }

  @SubscribeMessage('userUnmute')
  async userUnmute(client: Socket, payload: NewUserDto) {
    const token = client.handshake.headers.authorization;
    let payloadJwt: JwtPayload;
    payload.uid = client.id;

    try {
      // payload.socket = client;
      payloadJwt = this.jwtService.verify(token);
      await this.webrtcUsersWsService.userUnmute(client, payload, payloadJwt.id);
    } catch (error) {
      console.log({ error });

      client.disconnect();
      return;
    }

    this.server.to(payload.channelName).emit('updateUserList', this.webrtcUsersWsService.getConnectedClients()[payload.channelName]);
  }

  // Evento cuando un usuario deja un canal
  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(client: Socket, payload: NewUserDto) {
    payload.uid = client.id;
    // Remover al usuario de la sala/canal
    this.webrtcUsersWsService.unregisterClient(client, payload);

    // Notificar solo a los usuarios de la sala
    this.server.to(payload.channelName).emit('updateUserList', this.webrtcUsersWsService.getConnectedClients()[payload.channelName]);
  }

}
