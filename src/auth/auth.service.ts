import { BadRequestException, Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto, UpdateUserDto, VerifyPasswordOTP } from './dto';
import { PrismaClient, UserStatus, UserSuscription } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { googleVerify } from './helpers/google-verify.helper';
import * as UsesCase from '../core/use-cases';
import { facebookFetcher } from 'src/config/adapters/facebook.adapter';
import { SubscriptionType } from 'src/payments/enum/suscription-type.enum';
import { envs } from 'src/config/env';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(AuthService.name);

    onModuleInit() {
        this.$connect();
        this.logger.log('Connected to the database');
    }

    constructor(
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ) {
        super();
    }

    async findUserById(id: string) {
        return this.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                avatar: true,
                suscription: true
            }
        });
    }

    private async findUserByEmail(email: string) {
        return this.user.findUnique({
            where: {
                email
            }
        });
    }

    async reactiveUser(email: string) {
        const user = await this.findUserByEmail(email);
        if (!user) throw new BadRequestException('USER_NOT_FOUND');
        const userUpdate = await this.user.update({
            data: {
                status: UserStatus.ACTIVE,
                deleteDate: null
            },
            where: {
                id: user.id
            }
        });

        const { password: __, ...rest } = userUpdate;

        return {
            user: rest,
            token: this.generateJwt({ id: rest.id })
        }
    }

    async loginUser(loginUserDto: LoginUserDto) {

        const user = await this.findUserByEmail(loginUserDto.email);
        if (!user) throw new BadRequestException(`INCORRECT_CREDENTIALS`);
        const isValidPassword = bcrypt.compareSync(loginUserDto.password, user.password);
        if (!isValidPassword) throw new BadRequestException(`INCORRECT_CREDENTIALS`);
        if (user.status === UserStatus.PENDING) throw new BadRequestException({ message: `EMAIL_NOT_VERIFY`, token: this.generateJwt({ id: user.id }) });
        if (user.status === UserStatus.INACTIVE) throw new UnauthorizedException(`INACTIVE_USER`);

        const { password: __, ...rest } = user;

        return {
            user: rest,
            token: this.generateJwt({ id: user.id })
        }
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.user.findUnique({ where: { id } });
        if (!user) throw new BadRequestException(`USER_NOT_FOUND`);
        if (user.status === UserStatus.PENDING) throw new BadRequestException(`EMAIL_NOT_VERIFY`);
        if (user.status === UserStatus.INACTIVE) throw new UnauthorizedException(`INACTIVE_USER`);

        const updateUser = await this.user.update({
            data: updateUserDto,
            where: {
                id: user.id
            }
        });

        const { password: __, ...userRest } = updateUser;

        return {
            user: userRest,
            token: this.generateJwt({ id: userRest.id })
        }
    }

    async deleteAccount(id: string) {
        const user = await this.user.findUnique({ where: { id } });
        if (user.status === UserStatus.INACTIVE) throw new UnauthorizedException(`INACTIVE_USER`);

        const currentDate = new Date();
        const deleteDate = new Date();
        deleteDate.setDate(currentDate.getDate() + 30);

        const updateUser = await this.user.update({
            data: {
                status: UserStatus.INACTIVE,
                deleteDate: deleteDate
            },
            where: {
                id: user.id
            }
        })

        const { password: __, ...userRest } = updateUser;
        return {
            user: userRest,
            token: this.generateJwt({ id: userRest.id })
        }
    }

    async registerUser(registeruserDto: RegisterUserDto) {

        const user = await this.findUserByEmail(registeruserDto.email);

        if (user) throw new BadRequestException(`EMAIL_ALREADY_REGISTER`);

        const newUser = await this.user.create({
            data: {
                email: registeruserDto.email,
                name: registeruserDto.name,
                password: bcrypt.hashSync(registeruserDto.password, 10),
                avatar: registeruserDto.avatar,
                otp: this.generarOTP(4),
            }
        });

        const { password: __, ...userRest } = newUser;

        try {
            await this.mailService.sendMail({
                to: userRest.email,
                OTP: userRest.otp
            });
        } catch (error) {
            this.logger.log(error);
        }

        return {
            user: userRest,
            token: this.generateJwt({ id: userRest.id })
        }
    }

    async recoveryPassword(email: string) {
        const user = await this.findUserByEmail(email);
        if (!user) throw new BadRequestException(`USER_NOT_FOUND`);
        if (user.status === UserStatus.PENDING) throw new BadRequestException(`EMAIL_NOT_VERIFY`);
        if (user.status === UserStatus.INACTIVE) throw new UnauthorizedException(`INACTIVE_USER`);
        if (user.google) throw new BadRequestException(`USER_REG_GOOGLE`);
        if (user.apple) throw new BadRequestException(`USER_REG_APPLE`);
        if (user.facebook) throw new BadRequestException(`USER_REG_FACEBOOK`);

        const otp = this.generarOTP(4);
        await this.user.update({
            data: {
                otpPassword: otp,
                estadoPasswordOTP: false
            },
            where: {
                id: user.id
            }
        });

        try {
            await this.mailService.sendMailRecuperarPassword({
                to: email,
                OTP: otp
            });
        } catch (error) {
            this.logger.log(error);
            throw new BadRequestException(`ERROR_SENDING_MAIL`);
        }

        return {
            message: `OTP_SEND_MAIL`
        }
    }

    async verifyPasswordOtp(verifyPasswordOTP: VerifyPasswordOTP) {
        const user = await this.findUserByEmail(verifyPasswordOTP.email);
        if (user.estadoPasswordOTP) throw new BadRequestException(`OTP_ALREADY_VERIFY`);
        if (user.otpPassword !== verifyPasswordOTP.otp) throw new BadRequestException(`INVALID_OTP`);

        const userUpdate = await this.user.update({
            data: {
                estadoPasswordOTP: true
            },
            where: {
                id: user.id
            }
        })

        const { password: __, ...userRest } = userUpdate;

        return {
            user: userRest,
            token: this.generateJwt({ id: userRest.id })
        }

    }


    async changePassword(password: string, id: string) {
        const user = await this.user.findUnique({ where: { id } });
        if (!user) throw new BadRequestException(`USER_NOT_FOUND`);
        if (!user.estadoPasswordOTP) throw new BadRequestException(`INVALID_OTP`);
        const updateUser = await this.user.update({
            data: {
                password: bcrypt.hashSync(password, 10),
                estadoPasswordOTP: false,
                otpPassword: null
            },
            where: {
                id: user.id
            }
        });

        const { password: __, ...userRest } = updateUser;

        return {
            user: userRest,
            token: this.generateJwt({ id: userRest.id })
        }

    }

    async resendOTP(id: string) {
        const user = await this.user.findUnique({ where: { id } });
        if (user.status == UserStatus.ACTIVE) throw new BadRequestException(`EMAIL_ALREADY_VERIFY`);
        try {
            await this.mailService.sendMailRecuperarPassword({
                to: user.email,
                OTP: user.otp
            });
        } catch (error) {
            this.logger.log(error);
            throw new BadRequestException(`ERROR_SENDING_MAIL`);
        }

        const { password: __, ...userRest } = user;

        return {
            user: userRest,
            token: this.generateJwt({ id: userRest.id })
        }
    }

    async verifyEmail(otp: string, id?: string) {
        const user = await this.user.findUnique({ where: { id } });
        if (user.status == UserStatus.ACTIVE) throw new BadRequestException(`EMAIL_ALREADY_VERIFY`);
        if (user.otp !== otp) throw new BadRequestException(`INVALID_OTP`);

        const updateUser = await this.user.update({
            data: {
                status: UserStatus.ACTIVE,
                otp: null
            },
            where: {
                id: user.id
            }
        });

        const { password: __, ...userRest } = updateUser;

        return {
            user: userRest,
            token: this.generateJwt({ id: userRest.id })
        }
    }

    async facebookSignin(token: string) {
        let data = null;
        try {
            data = await UsesCase.facebookLoginUseCase(facebookFetcher, token);
        } catch (error) {
            throw new BadRequestException(`ERROR_FACEBOOK_SIGN_IN`);
        }

        if (!data) throw new BadRequestException(`ERROR_FACEBOOK_SIGN_IN`);
        const user = await this.findUserByEmail(data.email);

        if (!user) {
            const otp = this.generarOTP(4);

            const newUser = await this.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    avatar: data.picture,
                    password: bcrypt.hashSync(data.email, 10),
                    otp,
                    facebook: true,
                    status: UserStatus.ACTIVE
                }
            });

            const { password: __, ...userRest } = newUser;

            try {
                await this.mailService.sendMail({
                    to: userRest.email,
                    OTP: userRest.otp
                });
            } catch (error) {
                this.logger.log(error);
            }

            return {
                user: userRest,
                token: this.generateJwt({ id: userRest.id })
            }
        } else {
            if (user.status === UserStatus.PENDING) throw new BadRequestException({ message: `EMAIL_NOT_VERIFY`, token: this.generateJwt({ id: user.id }) });
            if (user.status === UserStatus.INACTIVE) throw new UnauthorizedException({ message: `INACTIVE_USER`, email: user.email });

            const { password: __, ...rest } = user;

            return {
                user: rest,
                token: this.generateJwt({ id: user.id })
            }
        }
    }

    async googleSignin(token: string) {
        let data = null;
        try {
            data = await googleVerify(token);


        } catch (error) {
            throw new BadRequestException(`ERROR_GOOGLE_SIGN_IN`);
        }

        if (!data) throw new BadRequestException(`ERROR_GOOGLE_SIGN_IN`);
        const { correo, nombre, img } = data;
        const user = await this.findUserByEmail(correo);

        if (!user) {
            const otp = this.generarOTP(4);

            const newUser = await this.user.create({
                data: {
                    email: correo,
                    name: nombre,
                    avatar: img,
                    password: bcrypt.hashSync(correo, 10),
                    otp,
                    google: true,
                    status: UserStatus.ACTIVE
                }
            });

            const { password: __, ...userRest } = newUser;

            try {
                await this.mailService.sendMail({
                    to: userRest.email,
                    OTP: userRest.otp
                });
            } catch (error) {
                this.logger.log(error);
            }

            return {
                user: userRest,
                token: this.generateJwt({ id: userRest.id })
            }
        }

        if (user.status === UserStatus.PENDING) throw new BadRequestException({ message: `EMAIL_NOT_VERIFY`, token: this.generateJwt({ id: user.id }) });
        if (user.status === UserStatus.INACTIVE) throw new UnauthorizedException({ message: `INACTIVE_USER`, email: user.email });

        const { password: __, ...rest } = user;

        return {
            user: rest,
            token: this.generateJwt({ id: user.id })
        }
    }

    async verifyToken(id: string) {
        const user = await this.user.findUnique({ where: { id } });
        if (!user) throw new BadRequestException(`USER_NOT_FOUND`);
        if (user.status === UserStatus.PENDING) throw new BadRequestException(`EMAIL_NOT_VERIFY`);
        if (user.status === UserStatus.INACTIVE) throw new UnauthorizedException(`INACTIVE_USER`);
        return {
            user: user,
            token: this.generateJwt({ id: user.id })
        }
    }


    private generarOTP(len = 4) {
        let otp = String(Math.floor(1000 + Math.random() * 9000));
        return ((len <= 6 && len > 2) ? otp.slice(0, len) : otp);
    };

    generateJwt(payload: JwtPayload) {
        return this.jwtService.sign(payload);
    }

    async getListInactiveAccount() {
        return await this.user.findMany({
            where: {
                status: UserStatus.INACTIVE,
            }
        });
    }

    async getListPremiumAccount() {
        return await this.user.findMany({
            where: {
                suscription: UserSuscription.PREMIUM
            }
        })
    }

    async deleteUsers(list: string[]) {
        const result = await this.user.deleteMany({
            where: {
                id: {
                    in: list
                }
            }
        });

        return result.count;
    }

    async cancelPremiumUsers(list: string[]) {
        const result = await this.user.updateMany({
            data: {
                suscription: UserSuscription.FREE,
                suscriptionDate: null
            },
            where: {
                id: {
                    in: list
                }
            }
        });

        return result.count;
    }

    async premiumUser(id: string, subscriptionType: string) {
        try {
            console.log('subscriptionType', subscriptionType);

            const today = new Date();
            let expirationDate;

            let addMonth;

            switch (subscriptionType) {
                case SubscriptionType.ONE_MONTH:
                    addMonth = 1;
                    break;
                case SubscriptionType.SIX_MONTH:
                    addMonth = 6;
                    break;
                case SubscriptionType.ONE_YEAR:
                    addMonth = 12;
                    break;
                case envs.googleOneMonth:
                    addMonth = 1;
                    break;
                case envs.googleSixMonth:
                    addMonth = 6;
                    break;
                case envs.googleOneYear:
                    addMonth = 12;
                    break;
                default:
                    break;
            }

            const currentUser = await this.user.findUnique({
                where: {
                    id
                }
            });

            if (currentUser.suscriptionDate) {
                expirationDate = new Date(currentUser.suscriptionDate);
            } else {
                expirationDate = new Date(today);
            }

            console.log('expirationDate', expirationDate)
            const currentMonth = expirationDate.getMonth();
            const newMonth = currentMonth + addMonth;
            expirationDate.setMonth(newMonth);

            // Verifica que expirationDate no sea una fecha inválida
            if (isNaN(expirationDate.getTime())) {
                console.log("La fecha de expiración es inválida");
            }

            console.log(expirationDate);


            const userUpdate = await this.user.update({
                data: {
                    suscription: UserSuscription.PREMIUM,
                    suscriptionDate: expirationDate
                },
                where: {
                    id
                }
            });

            const { password: __, ...rest } = userUpdate
            console.log('rest', rest);

            return {
                user: rest,
                token: this.generateJwt({ id: rest.id })
            }
        } catch (error) {
            console.log('error', error);

            return null;
        }
    }

}
