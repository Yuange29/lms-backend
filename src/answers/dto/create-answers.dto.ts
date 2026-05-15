import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @MinLength(0)
  answer_text!: string;

  @IsBoolean()
  @IsNotEmpty()
  is_correct!: boolean;
}
