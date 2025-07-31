import { BadRequestException, Controller, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { fileFilter } from './helpers/fileFilter.helper';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter
  }))
  @UseGuards(AuthGuard('jwt'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new BadRequestException('INVALID_FILE');

    const uploadResult = await this.filesService.uploadFile(file);
    console.log('URL o ruta de la imagen cargada:', uploadResult);

    return { message: 'IMAGE_UPDATE', url: uploadResult.publicUrl };
  }

  @Post('update-avatar')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter
  }))
  @UseGuards(AuthGuard('jwt'))
  async updateAvatar(@UploadedFile() file: Express.Multer.File, @GetUser('id') id: string) {
    if (!file) throw new BadRequestException('INVALID_FILE');
    const uploadResult = await this.filesService.uploadFile(file);
    if (uploadResult?.publicUrl) {
      return this.filesService.updateUserAvatar(id, uploadResult.publicUrl);
    }
    throw new BadRequestException(`IMAGE_UNABLE_UPDATE_`)
  }
}

