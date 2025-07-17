import {forwardRef, Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import {UserModule} from "../user/user.module";
import {UserController} from "../user/user.controller";
import {AuthController} from "./auth.controller";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'YOUR_JWT_SECRET_KEY', // replace with env variable in prod
            signOptions: { expiresIn: '1h' },
        }),
        forwardRef(() => UserModule),
    ],
    controllers: [AuthController],

    providers: [JwtStrategy],
    exports: [JwtModule, PassportModule],
})
export class AuthModule {}
