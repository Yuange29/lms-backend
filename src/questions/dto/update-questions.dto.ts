import { IsOptional, IsString, MinLength } from 'class-validator';
import { QuestionType } from 'src/common/enums/question-type.enum';

export class UpdateQuestionsDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  questionText!: string;

  @IsString()
  @IsOptional()
  type!: QuestionType;
}
