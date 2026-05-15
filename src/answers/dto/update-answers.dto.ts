import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateAnswerDto {
  @IsString()
  @MinLength(0)
  @IsOptional()
  answer_text!: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  is_correct!: boolean;
}
