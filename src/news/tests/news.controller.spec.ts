import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import { NewsController } from '../news.controller';
import { NewsService } from '../services/news.service';
import { FindByTitleInputDto } from '../dto/findByTitle.dto';
import { FindInputDto } from '../dto/find.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';	

// src/news/news.controller.test.ts

describe('NewsController', () => {
  let app: INestApplication;
  let newsServiceMock: Partial<NewsService>;

  const mockResponse = {
    total: 1,
    news: [
      {
        title: "Werner Kok: Sharks wing to join Ulster on two-year deal in the summer",
        description: "South African winger Werner Kok is to join Ulster from the Sharks in the summer, the Irish province have confirmed.",
        url: "https://www.bbc.com/sport/rugby-union/68554378",
        image: "https://ichef.bbci.co.uk/live-experience/cps/624/cpsprodpb/1EF0/production/_132902970_gettyimages-1737974418.jpg",
        publishedAt: "2024-03-13T13:05:37Z",
        source: {
          name: "BBC News",
          url: "https://www.bbc.com",
        },
      },
    ],
  };

  beforeAll(async () => {
    newsServiceMock = {
      getNewsByTitle: jest.fn().mockResolvedValue(mockResponse),
      getNews: jest.fn().mockResolvedValue(mockResponse),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
				{ provide: NewsService, useValue: newsServiceMock },
				{ provide: CACHE_MANAGER, useValue: {} }
			],
    }).compile();

    app = moduleFixture.createNestApplication();

		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true, // Strip unknown properties
				forbidNonWhitelisted: true, // Throw error for unknown properties
				transform: true, // Automatically transform payloads to DTO instances
			}),
		);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /news/findByTitle', () => {
    it('should return 200 with valid input', async () => {
      const validInput: FindByTitleInputDto = { 
				title: 'Test News' 
			};

      const response = await request(app.getHttpServer())
        .post('/news/findByTitle')
        .send(validInput)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
    });

    it('should return 400 with invalid input', async () => {
      const invalidInput = {}; // Missing required fields

      await request(app.getHttpServer())
        .post('/news/findByTitle')
        .send(invalidInput)
        .expect(400);
    });
  });

  describe('POST /news/find', () => {
    it('should return 200 with valid input', async () => {
      const validInput: FindInputDto = { 
				"q": "123",
				"offset": 1,
				"limit": 100
			};

      const response = await request(app.getHttpServer())
        .post('/news/find')
        .send(validInput)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
    });

    it('should return 400 with invalid input', async () => {
      const invalidInput = {}; // Missing required fields

      await request(app.getHttpServer())
        .post('/news/find')
        .send(invalidInput)
        .expect(400);
    });
  });
});