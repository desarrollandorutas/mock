export class NewUserDto {
    uid: string;
    channelName: string;
    user: WebSocketUser;
    socket: CustomSocket;
    mute: boolean;
}

export class WebSocketUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

interface CustomSocket {
    id: string;
    disconnect: () => void;
}