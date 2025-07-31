import { HttpAdapter } from "src/config/adapters/http/http.adapter";
import { FacebookLogin } from "src/core/entities/facebook-login.entity";
import { FacebookLoginResponse } from "src/inftrastructure/interfaces/facebook-login.responses";
import { FacebookLoginMapper } from "src/inftrastructure/mappers/facebook-login.mapper";

export const facebookLoginUseCase = async (fetcher: HttpAdapter, token: string): Promise<FacebookLogin> => {
    try {
        const response = await fetcher.get<FacebookLoginResponse>(`/me?fields=id,name,email,picture&access_token=${token}`);

        return FacebookLoginMapper.fromFacebookLoginResponseToEntity(response);
    } catch (error) {
        console.log('error', error);
        return null;
    }
}