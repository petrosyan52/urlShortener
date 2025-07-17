import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'YOUR_JWT_SECRET_KEY', // use env var in production!
        });
    }

    async validate(payload: any) {
        // Return minimal info used by the app to fetch full user later
        return { userId: payload.sub, email: payload.email };
    }
}
