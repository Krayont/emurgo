import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

//
import { NewsAdapter } from './adapter.interface';

//
import { FindInputDto, FindOutputDto } from '../dto/find.dto';
import { FindByTitleInputDto } from '../dto/findByTitle.dto';

//
@Injectable()
export class GNewsAdapter implements NewsAdapter {

  private readonly host: string;
  private readonly apiKey: string;

  //
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.host = this.configService.get<string>('news.gnews.host');
    this.apiKey = this.configService.get<string>('news.gnews.api_key');
  }

  //
  async fetchNewsByTitle(request: FindByTitleInputDto): Promise<FindOutputDto> {
    try {
      const response = await lastValueFrom(
    this.httpService.get(this.host, {
      params: {
      apikey: this.apiKey,
      q:  `"${request.title ?? ''}"`,
      in: 'title',
      max: 1,
      lang: 'en',
      expand: true, // Only works if you have a paid subscription active account ...
      },
    }),
    );

      return {
        total: response.data.totalArticles,
        news: response.data.articles.map((article) => {
          return {
            title: article.title,
            description: article.description,
            url: article.url,
            image: article.image,
            publishedAt: article.publishedAt,
            source: {
              name: article.source.name,
              url: article.source.url,
            }
          }
        }),
      };

    } catch (error) {
      //
      throw new Error('Failed to fetch news by title from GNews API');
  }
  }

  //
  async fetchNews(request: FindInputDto): Promise<FindOutputDto> {
    //
    try {
      const response = await lastValueFrom(
        this.httpService.get(this.host, {
          params: {
            apikey: this.apiKey,
            q:  `"${request.q ?? ''}"`,
            in: 'title, description, content',
            max: request.limit,
            lang: 'en',
            page: request.offset, // Only works if you have a paid subscription active account ...
          },
        }),
      );

      return {
        total: response.data.totalArticles,
        news: response.data.articles.map((article) => {
          return {
            title: article.title,
            description: article.description,
            url: article.url,
            image: article.image,
            publishedAt: article.publishedAt,
            source: {
              name: article.source.name,
              url: article.source.url,
            }
          }
        }),
      };

    } catch (error) {
      throw new Error('Failed to fetch news from GNews API');
    }
  }
}