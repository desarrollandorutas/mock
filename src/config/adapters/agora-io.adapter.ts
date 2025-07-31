import { envs } from "../env";
import { AxiosAdapter } from "./http/axios.adapter";

export const agoraIoFetcher = new AxiosAdapter({
    baseURL: envs.agoraIoUrl,
    params: {}
})