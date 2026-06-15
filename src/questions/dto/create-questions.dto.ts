import { IsString } from 'class-validator';
import { QuestionType } from 'src/common/enums/question-type.enum';

export class CreateQuestionsDto {
  @IsString()
  question_text!: string;

  @IsString()
  type!: QuestionType;
}
