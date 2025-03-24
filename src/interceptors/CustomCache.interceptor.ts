import { Injectable, ExecutionContext } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request } from 'express';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();

    // Generate a cache key based on the request URL and body
    const url = request.url;
    const body = JSON.stringify(request.body);

    // Combine the URL and body to create a unique cache key
    return `${url}:${body}`;
  }
}