import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  thumbnail_url!: string;

  @IsNumber()
  @Min(0)
  price!: number;
}
