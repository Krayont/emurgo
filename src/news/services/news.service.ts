import { Injectable } from '@nestjs/common';
import { GNewsAdapter } from '../adapters/gnews.adapter';

import { FindInputDto, FindOutputDto } from '../dto/find.dto';
import { FindByTitleInputDto } from '../dto/findByTitle.dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly gNewsAdapter: GNewsAdapter,
  ) {}

  //
  async getNewsByTitle(request: FindByTitleInputDto): Promise<FindOutputDto> {
    return await this.gNewsAdapter.fetchNewsByTitle(request);
  }

  //
  async getNews(request: FindInputDto): Promise<FindOutputDto> {
    return await this.gNewsAdapter.fetchNews(request);
  }
}
