import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateQuizDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  time_limit?: number;
}
