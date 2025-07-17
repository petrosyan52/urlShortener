import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Url} from "./url/url.entity";
import { UserModule } from './user/user.module';
import {User} from "./user/user.entity";
import {UserLoaderGuard} from "./auth/UserLoaderGuard";
import {JwtStrategy} from "./auth/jwt.strategy";
import {ConfigModule, ConfigService} from '@nestjs/config';
import { ClickModule } from './click/click.module';
import {Click} from "./click/click.entity";
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    UrlModule,
    ConfigModule.forRoot({
      isGlobal: true, // so you don't have to import ConfigModule everywhere
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'global',
          limit: 500,
          ttl: 60000,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Disable in production
        entities: [Url,User,Click],

      }),
    }),
    UserModule,
    ClickModule,
  ],
  controllers: [AppController],
  providers: [AppService,UserLoaderGuard, JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
