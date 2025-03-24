import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerModule } from 'nestjs-pino';
import * as pino from 'pino';
import * as pinoMultiStream from 'pino-multi-stream';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

//
import { AppConfigModule } from './config/appConfig.module';
import { HealthModule } from './health/health.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        // 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
        const streams = [
          { 
            level: 'info', 
            stream: pino.transport({
              target: 'pino/file',
              options: {
                destination: './logs/app.log', // Log file path
                mkdir: true, // Create the directory if it doesn't exist
                interval: '1d', // Rotate daily
              },
            }),
          }, // Logs for info and above
          { 
            level: 'error', 
            stream: pino.transport({
              target: 'pino/file',
              options: {
                destination: './logs/error.log', // Log file path for errors
                mkdir: true, // Create the directory if it doesn't exist
                interval: '1d', // Rotate daily
              },
            }),
          }, // Logs for error and above
        ];

        //
        return {
          pinoHttp: {
            stream: pinoMultiStream.multistream(streams),
            level: config.get('LOG_LEVEL') || 'info', 
            prettyPrint: config.get('NODE_ENV') === 'development',
            genReqId: (request) => request.headers['x-correlation-id'] || uuidv4(),
          },
        };
      }
    }),
    // probably change this to use Redis
    CacheModule.register({ 
      ttl: 5000, 
      max: 10, // maximum number of items in cache
      isGlobal: true,
    }),
    HealthModule, 
    NewsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
