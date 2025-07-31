import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/env';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        secret: envs.jtwSecret,
        signOptions: {
          expiresIn: '1d'
        }
      })
    })
  ],
  exports: [JwtStrategy, PassportModule, JwtModule, AuthService]
})
export class AuthModule { }
