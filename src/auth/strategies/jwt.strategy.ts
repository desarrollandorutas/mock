import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthService } from "../auth.service";
import { envs } from "src/config/env";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserStatus } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService) {
        super({
            secretOrKey: envs.jtwSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload) {
        const { id } = payload;

        const user = await this.authService.findUserById(id);
        if (!user) throw new UnauthorizedException(`INVALID_TOKEN`);
        if (user.status === UserStatus.INACTIVE) throw new UnauthorizedException(`INACTIVE_USER`);

        return user;
    }
}