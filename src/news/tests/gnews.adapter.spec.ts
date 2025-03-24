import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GNewsAdapter } from '../adapters/gnews.adapter';
import { FindByTitleInputDto } from '../dto/findByTitle.dto';
import { FindInputDto } from '../dto/find.dto';
import { of, throwError } from 'rxjs';
import { AxiosHeaders } from 'axios';

describe('GNewsAdapter', () => {
  let gNewsAdapter: GNewsAdapter;
  let httpServiceMock: Partial<HttpService>;
  let configServiceMock: Partial<ConfigService>;

  const mockApiResponse = {
    data: {
      totalArticles: 1,
      articles: [
        {
          title: 'Mocked News Title',
          description: 'Mocked News Description',
          url: 'https://mocked-url.com',
          image: 'https://mocked-image.com/image.jpg',
          publishedAt: '2024-03-13T13:05:37Z',
          source: {
            name: 'Mocked Source',
            url: 'https://mocked-source.com',
          },
        },
      ],
    },
  };

  beforeEach(async () => {
    httpServiceMock = {
      get: jest.fn(),
    };

    configServiceMock = {
      get: jest.fn((key: string) => {
        if (key === 'news.gnews.host') return 'https://mocked-gnews-api.com';
        if (key === 'news.gnews.api_key') return 'mocked-api-key';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GNewsAdapter,
        { provide: HttpService, useValue: httpServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    gNewsAdapter = module.get<GNewsAdapter>(GNewsAdapter);
  });

  describe('fetchNewsByTitle', () => {
    it('should return transformed response when API call is successful', async () => {
      const input: FindByTitleInputDto = { title: 'Test Title' };

      jest.spyOn(httpServiceMock, 'get').mockReturnValue(of({
        data: mockApiResponse.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      }));

      const result = await gNewsAdapter.fetchNewsByTitle(input);

      expect(httpServiceMock.get).toHaveBeenCalledWith('https://mocked-gnews-api.com', {
        params: {
          apikey: 'mocked-api-key',
          q: '"Test Title"',
          in: 'title',
          max: 1,
          lang: 'en',
          expand: true,
        },
      });

      expect(result).toEqual({
        total: 1,
        news: [
          {
            title: 'Mocked News Title',
            description: 'Mocked News Description',
            url: 'https://mocked-url.com',
            image: 'https://mocked-image.com/image.jpg',
            publishedAt: '2024-03-13T13:05:37Z',
            source: {
              name: 'Mocked Source',
              url: 'https://mocked-source.com',
            },
          },
        ],
      });
    });

    it('should throw an error when API call fails', async () => {
      const input: FindByTitleInputDto = { title: 'Test Title' };

      jest.spyOn(httpServiceMock, 'get').mockReturnValue(throwError(() => new Error('API Error')));

      await expect(gNewsAdapter.fetchNewsByTitle(input)).rejects.toThrow('Failed to fetch news by title from GNews API');
    });
  });

  describe('fetchNews', () => {
    it('should return transformed response when API call is successful', async () => {
      const input: FindInputDto = { q: 'Test Query', offset: 0, limit: 10 };


      jest.spyOn(httpServiceMock, 'get').mockReturnValue(of({
        data: mockApiResponse.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      }));

      const result = await gNewsAdapter.fetchNews(input);

      expect(httpServiceMock.get).toHaveBeenCalledWith('https://mocked-gnews-api.com', {
        params: {
          apikey: 'mocked-api-key',
          q: '"Test Query"',
          in: 'title, description, content',
          max: 10,
          lang: 'en',
          page: 0,
        },
      });

      expect(result).toEqual({
        total: 1,
        news: [
          {
            title: 'Mocked News Title',
            description: 'Mocked News Description',
            url: 'https://mocked-url.com',
            image: 'https://mocked-image.com/image.jpg',
            publishedAt: '2024-03-13T13:05:37Z',
            source: {
              name: 'Mocked Source',
              url: 'https://mocked-source.com',
            },
          },
        ],
      });
    });

    it('should throw an error when API call fails', async () => {
      const input: FindInputDto = { q: 'Test Query', offset: 0, limit: 10 };

      jest.spyOn(httpServiceMock, 'get').mockReturnValue(throwError(() => new Error('API Error')));

      await expect(gNewsAdapter.fetchNews(input)).rejects.toThrow('Failed to fetch news from GNews API');
    });
  });
});