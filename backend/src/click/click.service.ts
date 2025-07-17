import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Click } from './click.entity';
import { Repository } from 'typeorm';
import { Url } from '../url/url.entity';

@Injectable()
export class ClickService {
    constructor(
        @InjectRepository(Click)
        private clickRepository: Repository<Click>,
    ) {}

    async trackClick(data: {
        url: Url;
        ip: string;
        browser?: string;
        os?: string;
        language?: string;
    }) {
        const click = this.clickRepository.create(data);
        return this.clickRepository.save(click);
    }
}
