import { Request } from "express";

export const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {

    if (!file) return cb(new Error('NOT_FILE_FOUND'), false);
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif']
    const extensions = file.mimetype.split('/')[1];
    if (!validExtensions.includes(extensions)) return cb(null, false);

    cb(null, true);
}