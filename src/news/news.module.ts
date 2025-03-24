import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { NewsService } from './services/news.service';
import { NewsController } from './news.controller';
import { GNewsAdapter } from './adapters/gnews.adapter';

import { LoggerMiddleware } from '../middlewares/logger.middleware';

@Module({
  imports: [HttpModule],
  controllers: [NewsController],
  providers: [NewsService, GNewsAdapter],
})

export class NewsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('news/find');
  }
}
