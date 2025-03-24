import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Request 
export class FindByTitleInputDto {
  @ApiProperty({
    type: String,
    description: 'Title of the news',
    required: true,
    example: 'Apple',
  })
  @IsString()
  @IsNotEmpty()
  title: string; 
}
