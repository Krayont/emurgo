import { Controller, Post, Body, HttpCode, UseInterceptors } from '@nestjs/common';
import { CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';

//
import { NewsService } from './services/news.service';

//
import { FindInputDto, FindOutputDto } from './dto/find.dto';
import { FindByTitleInputDto } from './dto/findByTitle.dto';

//
import { CustomCacheInterceptor } from '../interceptors/CustomCache.interceptor';

//
@ApiTags('News')
@Controller('news')
@UseInterceptors(CustomCacheInterceptor)
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
  ) {}

  //
  @ApiOkResponse({
    type: FindOutputDto,
    isArray: false,
  })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Post('findByTitle')
  @CacheTTL(5000)
  @HttpCode(200) 
  findByTitle(@Body() request: FindByTitleInputDto) {
    //
    return this.newsService.getNewsByTitle(request);
  }

  //
  @ApiOkResponse({
    type: FindOutputDto,
    isArray: false,
  })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Post('find')
  @CacheTTL(5000)
  @HttpCode(200) 
  find(@Body() request: FindInputDto): Promise<FindOutputDto> {
    //
    return this.newsService.getNews(request);
  }

}
