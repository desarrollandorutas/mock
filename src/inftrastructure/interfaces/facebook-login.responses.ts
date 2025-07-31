export interface FacebookLoginResponse {
    id: string;
    name: string;
    email: string;
    picture: Picture;
}

export interface Picture {
    data: Data;
}

export interface Data {
    height: number;
    is_silhouette: boolean;
    url: string;
    width: number;
}
