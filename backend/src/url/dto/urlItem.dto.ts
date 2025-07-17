import {Url} from "../url.entity";

const BASE_URL = 'http://localhost:3001'; // or your real domain

export function urlItem(url,baseUrl:string): any {
    return {
        id: url.id,
        originalUrl: url.originalUrl,
        slug: url.slug,
        createdAt: url.createdAt,
        shortUrl: `${baseUrl}/${url.slug}`, // full URL here
        totalClicks: parseInt(url.totalClicks), // full URL here
    };
}
