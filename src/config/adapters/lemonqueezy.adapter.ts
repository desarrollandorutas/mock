import { envs } from "../env";
import { AxiosAdapter } from "./http/axios.adapter";

export const lemonqueezyFetcher = new AxiosAdapter({
    baseURL: envs.lemonqueezyUrl,
    params: {
        // "Authorization": `Bearer ${envs.lemonqueezyApikey}`,
        // "Accept": "application/vnd.api+json",
        // "Content-Type": "application/vnd.api+json"
    }
})