import { UploadFileResponse, DeleteFileResponse } from 'src/inftrastructure/interfaces/upload-file.responses';
import { HttpAdapter } from '../../../../config/adapters/http/http.adapter';
import { envs } from 'src/config/env';
import * as FormData from 'form-data';
import { v4 as uuid } from 'uuid';
import { UploadFileMapper } from 'src/inftrastructure/mappers/upload-file.mapper';
import { UploadFile } from 'src/core/entities/upload-file.entity';

export const uploadFileUseCase = async (fetcher: HttpAdapter, file: Express.Multer.File): Promise<UploadFile> => {

    try {
        const form = new FormData();
        const fileExtensions = file.mimetype.split('/')[1];
        const fileName = `${uuid()}.${fileExtensions}`;
        form.append('file', file.buffer, {
            filename: fileName,
            contentType: file.mimetype,
        });
        const response = await fetcher.post<UploadFileResponse>(envs.cloudFlareUrl, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${envs.cloudflareApi}`
            }
        });

        return UploadFileMapper.fromUploadCloudflareToEntity(response);
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export const deleteFileUseCase = async (fetcher: HttpAdapter, imageUrl: string): Promise<boolean> => {
    try {
        // Extraer el Image ID de la URL pública
        const imageId = extractImageIdFromUrl(imageUrl);

        // Construir la URL de la API de eliminación de imágenes de Cloudflare
        //Validar si requiere /public
        const apiUrl = `${envs.cloudFlareUrl}/${imageId}`;

        console.log(`${apiUrl} url imagen actual del usuario`);
        // Realizar la solicitud DELETE a la API de Cloudflare usando fetcher con solo el encabezado de autorización
        const response = await fetcher.delete<DeleteFileResponse>(apiUrl, {
            headers: {
                'Authorization': `Bearer ${envs.cloudflareApi}`
            }
        });
        
        if (response) {
            console.log(`Imagen con ID ${imageId} eliminada correctamente de Cloudflare.`);
            return true;
        } else {
            console.log(`No se pudo eliminar la imagen con ID ${imageId}. Código de estado: ${response}`);
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar la imagen de Cloudflare:', error);
        return false;
    }    
}

// Función para extraer el Image ID desde la URL pública de Cloudflare
const extractImageIdFromUrl = (publicUrl: string): string => {
    const segments = publicUrl.split('/');
    return segments[segments.length - 2]; // Obtiene el Image ID del penúltimo segmento
};
