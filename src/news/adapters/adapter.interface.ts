import { FindInputDto, FindOutputDto } from "../dto/find.dto";

//
export interface NewsAdapter {
  fetchNews(data: FindInputDto): Promise<FindOutputDto>;
}