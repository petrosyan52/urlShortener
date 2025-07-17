import {forwardRef, Module} from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Url} from "./url.entity";
import {User} from "../user/user.entity";
import {UserModule} from "../user/user.module";

@Module({

  imports: [TypeOrmModule.forFeature([Url]),
    forwardRef(() => UserModule),
  ],
  providers: [UrlService],
  controllers: [UrlController],
  exports:[UrlService]
})
export class UrlModule {}
