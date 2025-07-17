// src/url/dto/update-url.dto.ts
import { IsString, Matches, IsOptional, Length } from 'class-validator';

export class UpdateUrlDto {
    @IsString()
    @Length(20, 30)
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'Slug can only contain letters, numbers, underscore and dash',
    })
    slug: string;
}
