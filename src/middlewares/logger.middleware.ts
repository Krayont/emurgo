import { Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: any, res: any, next: () => void) {
    const { method, originalUrl, body, query } = req;

    this.logger.log({
      message: `Incoming Request: ${method} ${originalUrl}`,
      body,
      query,
    });

    next();
  }
}