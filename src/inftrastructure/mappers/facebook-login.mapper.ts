export class FacebookLoginMapper {
    static fromFacebookLoginResponseToEntity(response) {
        return {
            name: response.name,
            email: response.email,
            picture: response.picture.data.url
        };
    }
}