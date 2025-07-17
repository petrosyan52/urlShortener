import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { User } from '../user/user.entity';
import {urlItem} from "./dto/urlItem.dto";
import {ConfigService} from "@nestjs/config";
import {UpdateUrlDto} from "./dto/update-url.dto";

@Injectable()
export class UrlService {
    private readonly baseUrl: string;
    constructor(
        private configService: ConfigService,
        @InjectRepository(Url)
        private urlRepository: Repository<Url>,
    ) {
        this.baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3001';
    }

    async updateSlug(id: number, updateDto: UpdateUrlDto) {
        const url = await this.urlRepository.findOne({ where: { id } });
        if (!url) {
            throw new NotFoundException('URL not found');
        }

        // Check if slug is unique
        const slugExists = await this.urlRepository.findOne({ where: { slug: updateDto.slug } });
        if (slugExists && slugExists.id !== id) {
            throw new ConflictException('Slug already in use');
        }

        url.slug = updateDto.slug;
        await this.urlRepository.save(url);

        // Return updated URL with full shortUrl
        return {
            ...url,
            shortUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/${url.slug}`,
        };
    }

    private async generateUniqueSlug(length = 20): Promise<string> {
        let slug = '';
        let exists = true;

        while (exists) {
            slug = this.generateSlug(length);
            const found = await this.urlRepository.findOne({ where: { slug } });
            exists = !!found;
        }

        return slug;
    }

    private generateSlug(length: number): string {
        let result = '';
        while (result.length < length) {
            result += Math.random().toString(36).substring(2); // skip '0.'
        }
        return result.substring(0, length);
    }
    async create(originalUrl: string, user: User): Promise<Url> {
        const slug = await this.generateUniqueSlug();
        const newUrl = this.urlRepository.create({ slug, originalUrl, user });
        return this.urlRepository.save(newUrl);
    }

    async findAllByUser(user: User): Promise<any[]> {
        const urls = await this.urlRepository.createQueryBuilder('url')
            .leftJoin('url.clicks', 'click')
            .where('url.userId = :userId', { userId: user.id })
            .groupBy('url.id')
            .select([
                'url.id AS id',
                'url.originalUrl AS "originalUrl"',
                'url.slug AS slug',
                'url.createdAt AS "createdAt"',
            ])
            .orderBy('url.createdAt', 'DESC')
            .addSelect('COUNT(click.id)', 'totalClicks')
            .getRawMany();
        return urls.map((url) =>  urlItem(url,this.baseUrl));
    }




    findBySlug(slug: string): Promise<Url | null> {
        return this.urlRepository.findOne({ where: { slug } });
    }
}
