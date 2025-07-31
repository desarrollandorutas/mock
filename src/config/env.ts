import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    JWT_SECRET: string;
    CLOUDFLARE_URL: string;
    CLOUDFLARE_API: string;
    MAIL_EMAIL: string;
    MAIL_PASSWORD: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_ID_IOS: string;
    GOOGLE_CLIENT_ID_ANDROID: string;
    GOOGLE_CLIENT_ID_WEB: string;
    GOOGLE_CLIENT_ID_WEB2: string;
    GOOGLE_SCRET_ID: string;
    AGORA_APP_ID: string;
    AGORA_APP_CERTIFICATE: string;
    AGORA_TOKEN_EXP_PREMIUM: number;
    AGORA_TOKEN_EXP_FREE: number;
    AGORA_IO_URL: string;
    AGORA_IO_APIKEY: string;
    FACEBOOK_URL: string;
    DEFAULT_IMAGE: string;
    LEMONQUEEZY_URL: string;
    LEMONQUEEZY_APIKEY: string;
    LEMONQUEEZY_STORE: string;
    LEMONQUEEZY_ONE_MONTH: string;
    LEMONQUEEZY_SIX_MONTH: string;
    LEMONQUEEZY_ONE_YEAR: string;
    LEMONQUEEZY_SUBSCRIPTION: string;
    GOOGLE_ONE_MONTH: string;
    GOOGLE_SIX_MONTH: string;
    GOOGLE_1_YEAR: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    CLOUDFLARE_URL: joi.string().required(),
    CLOUDFLARE_API: joi.string().required(),
    MAIL_EMAIL: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_ID_IOS: joi.string().required(),
    GOOGLE_CLIENT_ID_ANDROID: joi.string().required(),
    GOOGLE_CLIENT_ID_WEB: joi.string().required(),
    GOOGLE_CLIENT_ID_WEB2: joi.string().required(),
    GOOGLE_SCRET_ID: joi.string().required(),
    AGORA_APP_ID: joi.string().required(),
    AGORA_APP_CERTIFICATE: joi.string().required(),
    AGORA_TOKEN_EXP_PREMIUM: joi.number().required(),
    AGORA_TOKEN_EXP_FREE: joi.number().required(),
    AGORA_IO_URL: joi.string().required(),
    AGORA_IO_APIKEY: joi.string().required(),
    FACEBOOK_URL: joi.string().required(),
    DEFAULT_IMAGE: joi.string().required(),
    LEMONQUEEZY_URL: joi.string().required(),
    LEMONQUEEZY_APIKEY: joi.string().required(),
    LEMONQUEEZY_STORE: joi.string().required(),
    LEMONQUEEZY_ONE_MONTH: joi.string().required(),
    LEMONQUEEZY_SIX_MONTH: joi.string().required(),
    LEMONQUEEZY_ONE_YEAR: joi.string().required(),
    LEMONQUEEZY_SUBSCRIPTION: joi.string().required(),
    GOOGLE_ONE_MONTH: joi.string().required(),
    GOOGLE_SIX_MONTH: joi.string().required(),
    GOOGLE_1_YEAR: joi.string().required(),
})
    .unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    jtwSecret: envVars.JWT_SECRET,
    cloudFlareUrl: envVars.CLOUDFLARE_URL,
    cloudflareApi: envVars.CLOUDFLARE_API,
    mail: envVars.MAIL_EMAIL,
    mailPassword: envVars.MAIL_PASSWORD,
    googleClientId: envVars.GOOGLE_CLIENT_ID,
    googleClientIdIOS: envVars.GOOGLE_CLIENT_ID_IOS,
    googleClientIdANDROID: envVars.GOOGLE_CLIENT_ID_ANDROID,
    googleClientIdWeb: envVars.GOOGLE_CLIENT_ID_WEB,
    googleClientIdWeb2: envVars.GOOGLE_CLIENT_ID_WEB2,
    googleSecretId: envVars.GOOGLE_SCRET_ID,
    agoraAppId: envVars.AGORA_APP_ID,
    agoraAppCertificate: envVars.AGORA_APP_CERTIFICATE,
    agoraTokenExpPremium: envVars.AGORA_TOKEN_EXP_PREMIUM,
    agoraTokenExpFree: envVars.AGORA_TOKEN_EXP_FREE,
    agoraIoUrl: envVars.AGORA_IO_URL,
    agoraIoApiKey: envVars.AGORA_IO_APIKEY,
    facebookUrl: envVars.FACEBOOK_URL,
    defaultImage: envVars.DEFAULT_IMAGE,
    lemonqueezyUrl: envVars.LEMONQUEEZY_URL,
    lemonqueezyApikey: envVars.LEMONQUEEZY_APIKEY,
    lemonqueezyStore: envVars.LEMONQUEEZY_STORE,
    lemonqueezyOneMonth: envVars.LEMONQUEEZY_ONE_MONTH,
    lemonqueezySixMonth: envVars.LEMONQUEEZY_SIX_MONTH,
    lemonqueezyOneYear: envVars.LEMONQUEEZY_ONE_YEAR,
    lemonqueezySubscription: envVars.LEMONQUEEZY_SUBSCRIPTION,
    googleOneMonth: envVars.GOOGLE_ONE_MONTH,
    googleSixMonth: envVars.GOOGLE_SIX_MONTH,
    googleOneYear: envVars.GOOGLE_1_YEAR,
}