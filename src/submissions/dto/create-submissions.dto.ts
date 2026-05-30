import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SubmissionAnswers {
  @IsString()
  question_id!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  answers_id!: string[];
}

export class SubmissionAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmissionAnswers)
  answers!: SubmissionAnswers[];
}
