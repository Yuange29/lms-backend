import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;
}
