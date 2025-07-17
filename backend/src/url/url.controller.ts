import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Res,
    UseGuards,
    Req,
    NotFoundException,
    ParseIntPipe,
    Patch
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';  // you need to create this guard
import { Request } from 'express';
import {CurrentUser} from "../auth/current-user.decorator";
import {User} from "../user/user.entity";
import {UserLoaderGuard} from "../auth/UserLoaderGuard";
import {ConfigService} from "@nestjs/config";
import {SkipThrottle} from "@nestjs/throttler";
import {UpdateUrlDto} from "./dto/update-url.dto";

@Controller()
export class UrlController {
    private baseUrl: string;
    constructor(private readonly urlService: UrlService,private configService: ConfigService,) {

    }

    @UseGuards(JwtAuthGuard,UserLoaderGuard)
    @Post('url')
    async create(@CurrentUser()  user: User ,@Body('originalUrl') originalUrl: string, @Req() req: Request) {
        const url = await this.urlService.create(originalUrl, user);
        const baseUrl = this.configService.get<string>('BASE_URL')
        return {
            shortUrl: `${baseUrl}/${url.slug}`,
            ...url,
        };
    }

    @UseGuards(JwtAuthGuard,UserLoaderGuard)
    @Get('urls')
    async findAll(@CurrentUser()  user: User ,@Req() req: Request) {
        return this.urlService.findAllByUser(user);
    }
    @Patch('url/:id')
    async updateSlug(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateUrlDto,
    ) {
        return this.urlService.updateSlug(id, updateDto);
    }

}
