import { Controller, Get, Post, Body, Param, Res, UseGuards, Req, NotFoundException } from '@nestjs/common';
import {UrlService} from "../url/url.service";
import {ClickService} from "./click.service";
import { Request, Response } from 'express';
import * as uAgent from 'useragent';
import {Throttle} from '@nestjs/throttler';

@Controller()
export class ClickController {
    constructor(
        private readonly urlService: UrlService,
        private readonly clickService: ClickService,
    ) {}

    @Get(':slug')
    @Throttle({ global: { limit: 10, ttl: 1000 ,blockDuration:5000} })
    async redirect(@Param('slug') slug: string, @Req() req: Request, @Res() res: Response) {
        const url = await this.urlService.findBySlug(slug);
        if (!url) return res.status(404).send('Not found');

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';
        const language = req.headers['accept-language']?.split(',')[0] || '';
        const agent = uAgent.parse(userAgent);

        await this.clickService.trackClick({
            url,
            ip: typeof ip === 'string' ? ip : ip[0],
            browser: agent.family,
            os: agent.os.toString(),
            language,
            // optionally: country via IP geolocation
        });

        return res.redirect(url.originalUrl);
    }

}
