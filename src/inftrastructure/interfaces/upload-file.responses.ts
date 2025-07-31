export interface UploadFileResponse {
    result: Result;
    success: boolean;
    errors: any[];
    messages: any[];
}

export interface Result {
    id: string;
    filename: string;
    uploaded: Date;
    requireSignedURLs: boolean;
    variants: string[];
}

export interface DeleteFileResponse {
    result: Result;
    success: boolean;
    errors: any[];
    messages: any[];
}
