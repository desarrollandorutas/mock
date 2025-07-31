import { HttpAdapter } from 'src/config/adapters/http/http.adapter';
import { envs } from 'src/config/env';
import { ChannelExistResponse } from 'src/inftrastructure/interfaces/channel-exist.response';

export const getExistChannelUseCase = async (fetcher: HttpAdapter, channelName: string): Promise<boolean> => {

    try {
        const apiKey = envs.agoraIoApiKey;
        const { data } = await fetcher.get<ChannelExistResponse>(`${envs.agoraAppId}/${channelName}`, {
            headers: {
                'Authorization': `Basic  ${apiKey}`
            }
        })
        return data.channel_exist;
    } catch (error) {
        console.log('error', error);
        return false;
    }
}