import { IsString, MinLength } from 'class-validator';
import { QuestionType } from 'src/common/enums/question-type.enum';

export class CreateQuestionsDto {
  @IsString()
  @MinLength(3)
  questionText!: string;

  @IsString()
  type!: QuestionType;
}
