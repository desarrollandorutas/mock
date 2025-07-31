import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, UserStatus } from '@prisma/client';
import * as UsesCase from '../core/use-cases';
import { cloudflareFetcher } from '../config/adapters/cloudflare.adapter'
import { envs } from 'src/config/env';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FilesService extends PrismaClient {

    constructor(
        private readonly authservice: AuthService,
    ) {
        super();
    }

    async uploadFile(file: Express.Multer.File) {
        return await UsesCase.uploadFileUseCase(cloudflareFetcher, file);
    }

    // Método para actualizar el avatar del usuario y eliminar la imagen anterior si existe
    async updateUserAvatar(userId: string, newAvatarUrl: string) {
        // Obtener la información del usuario actual para acceder a la URL del avatar anterior
        const user = await this.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new BadRequestException(`USER_NOT_FOUND`);
        if (user.status === UserStatus.PENDING) throw new BadRequestException(`EMAIL_NOT_VERIFY`);
        if (user.status === UserStatus.INACTIVE) throw new UnauthorizedException(`INACTIVE_USER`);

        // Si el usuario ya tiene un avatar, eliminar la imagen anterior de Cloudflare
        if (user?.avatar && user.avatar !== envs.defaultImage) {
            console.log(`Avatar actual del usuario: ${user.avatar}`);
            const deleted = await UsesCase.deleteFileUseCase(cloudflareFetcher, user.avatar);
            if (!deleted) console.log('no se pudo eliminar imagen');

            const updateUser = await this.user.update({
                where: { id: userId },
                data: { avatar: newAvatarUrl },
            });

            const { password: __, ...userRest } = updateUser;

            return {
                user: userRest,
                token: this.authservice.generateJwt({ id: userRest.id })
            }

        } else {
            const updateUser = await this.user.update({
                where: { id: userId },
                data: { avatar: newAvatarUrl },
            });

            const { password: __, ...userRest } = updateUser;

            return {
                user: userRest,
                token: this.authservice.generateJwt({ id: userRest.id })
            }
        }
    }

}
