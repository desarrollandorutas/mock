import { envs } from "../env";
import { AxiosAdapter } from "./http/axios.adapter";

export const cloudflareFetcher = new AxiosAdapter({
    baseURL: envs.cloudFlareUrl,
    params: {}
})