import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from 'src/config/env';
import { ContactoMailDto } from './dto/contac-mail.dto';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: envs.mail,
                pass: envs.mailPassword, // Contraseña de aplicación específica
            },
        });
    }

    async sendMailRecuperarPassword(params: any): Promise<any> {
        try {
            let info = await this.transporter.sendMail({
                from: 'Inter Rider <no-reply@rexapp.cl>',
                replyTo: 'no-reply@rexapp.cl',
                to: params.to, // list of receivers
                subject: 'Recuperar contraseña', // Subject line
                html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>Recupera tu contraseña de Inter Rider.</h2>
            <h4></h4>
            <p style="margin-bottom: 30px;">Ingrese el OTP para validar tu identidad</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
            <p style="margin-top:50px;">Si no solicito la recuperación, contactese con contacto@rexapp.cl</p>
          </div>
        `,
            });
            return info;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async sendMail(params: any): Promise<any> {
        try {
            let info = await this.transporter.sendMail({
                from: 'Inter Rider <no-reply@rexapp.cl>',
                replyTo: 'no-reply@rexapp.cl',
                to: params.to, // list of receivers
                subject: 'Código de validación', // Subject line
                html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>Bienvenido a Inter Rider.</h2>
            <h4></h4>
            <p style="margin-bottom: 30px;">Ingrese la OTP de registro para comenzar</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
            <p style="margin-top:50px;">Si no solicita la verificación, contactese con contacto@rexapp.cl</p>
          </div>
        `,
            });
            return info;
        } catch (error) {
            console.error();
            return false;
        }
    }

    async sendContactMail(params: ContactoMailDto): Promise<any> {
        try {
            await this.transporter.sendMail({
                from: 'Inter Rider <no-reply@rexapp.cl>',
                replyTo: 'no-reply@rexapp.cl',
                to: 'contacto@rexapp.cl', // list of receivers
                subject: `Contacto usuario - ${params.from}`, // Subject line
                html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>Mensaje enviado desde la app.</h2>
            <h4></h4>
            <p style="margin-top:50px;">Titutlo: ${params.subject}</p>
            <p style="margin-top:50px;">Mensaje: ${params.message}</p>
            <p style="margin-top:50px;">Requiere contacto: ${params.contact ? 'sí' : 'no'}</p>
          </div>
        `,
            });
            return {
                ok: true,
                message: `message successful send`
            }
        } catch (error) {
            console.error();
            throw new BadRequestException(`ERROR_SENDING_MAIL`)
        }
    }

}