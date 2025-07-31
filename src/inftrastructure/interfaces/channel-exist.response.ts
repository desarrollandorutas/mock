export interface ChannelExistResponse {
    success: boolean;
    data: Data;
}

export interface Data {
    channel_exist: boolean;
    mode: number;
    total: number;
    users: number[];
}
