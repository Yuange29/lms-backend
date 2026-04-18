import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsString()
  @IsOptional()
  video_url!: string;

  @IsNumber()
  duration!: number;

  @IsBoolean()
  is_preview!: boolean;
}
