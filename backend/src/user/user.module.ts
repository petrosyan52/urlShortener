import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import {AuthModule} from "../auth/auth.module";
import {Url} from "../url/url.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'YOUR_JWT_SECRET_KEY', // change this to env var in prod!
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
