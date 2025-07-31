import { envs } from "../env";
import { AxiosAdapter } from "./http/axios.adapter";

export const facebookFetcher = new AxiosAdapter({
    baseURL: envs.facebookUrl,
    params: {}
})