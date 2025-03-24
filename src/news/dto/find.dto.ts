import { IsString, IsNumber, IsOptional, ValidateIf, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

//
import { NewsDto } from './news.dto';

// Request 
export class FindInputDto {
  @ApiProperty({
    type: String,
    description: 'Search query',
    required: false,
    example: 'Apple',
  })
  @IsString()
  q: string; 

  @ApiPropertyOptional({
    type: Number,
    description: 'Page number',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
	@Min(1)
	@Max(100)
  offset: number = 1; 

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
    required: false,
    example: 10,
  })
  @IsNumber()
  @IsOptional()
	@Min(1)
	@Max(100)
  limit: number = 10; 
}

// Response
export class FindOutputDto {
  @ApiProperty({
    type: Number,
    description: 'Total number of news',
    required: true,
    example: 100,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    type: [NewsDto],
    description: 'List of news',
    required: true,
    example: [
      {
        title: 'Apple',
        description: 'Apple is a company',
        url: 'https://apple.com',
        image: 'https://apple.com/image.jpg',
        publishedAt: '2021-09-01T00:00:00Z',
        source: {
          name: 'Apple News',
          url: 'https://apple.com/news',
        },
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewsDto)
  news: NewsDto[];
}