import { UploadFile } from "src/core/entities/upload-file.entity";
import { UploadFileResponse } from "../interfaces/upload-file.responses";

export class UploadFileMapper {

    static fromUploadCloudflareToEntity(response: UploadFileResponse): UploadFile {
        return {
            id: response.result.id,
            filename: response.result.filename,
            publicUrl: response.result.variants[0]
        }
    }
}