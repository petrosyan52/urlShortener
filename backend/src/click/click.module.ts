import {forwardRef, Module} from '@nestjs/common';
import { ClickService } from './click.service';
import { ClickController } from './click.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Click } from './click.entity';
import {UserModule} from "../user/user.module";
import {UrlModule} from "../url/url.module";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";

@Module({
  imports: [TypeOrmModule.forFeature([Click],),
    forwardRef(() => UrlModule),
  ],
  providers: [ClickService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
    ],
  controllers: [ClickController],
  exports: [ClickService],
})
export class ClickModule {}
