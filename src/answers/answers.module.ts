import { CommonModule } from 'src/common/common.module';
import { Question } from 'src/questions/entities/question.entity';
import { SubmissionAnswer } from 'src/submissions/entities/submission-answer.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { Answer } from './entities/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, Question, SubmissionAnswer]),
    CommonModule,
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
