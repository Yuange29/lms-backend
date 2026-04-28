import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  time_limit!: number;
}
