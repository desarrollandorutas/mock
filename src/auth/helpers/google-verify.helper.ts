import { OAuth2Client } from 'google-auth-library';
import { envs } from 'src/config/env';

const client = new OAuth2Client(envs.googleClientIdANDROID);

const CLIENT_ID_ARR = [
    envs.googleClientIdIOS,
    envs.googleClientIdANDROID,
    envs.googleClientIdWeb,
    envs.googleClientIdWeb2,
]

export const googleVerify = async (token: string) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID_ARR
    });

    const { name: nombre,
        picture: img,
        email: correo
    } = ticket.getPayload();

    return { nombre, img, correo };
}