import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

//
class NewsSourceDto {
  @IsString()
  name: string;

  @IsString()
  url: string;
}

//
export class NewsDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsString()
  url: string;

  @IsString()
  image: string;

  @IsString()
  publishedAt: string;

  @ValidateNested()
  @Type(() => NewsSourceDto)
  source: NewsSourceDto;
}
