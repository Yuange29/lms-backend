import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { Enrollment } from 'src/enrollments/entities/enrollent.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  SubmissionAnswers,
  SubmissionAnswersDto,
} from './dto/create-submissions.dto';
import { Submission } from './entities/submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(Enrollment)
    private readonly enrollRepo: Repository<Enrollment>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async create(
    createReq: SubmissionAnswersDto,
    userId: string,
    quizId: string,
  ) {
    const quizQuestions = await this.getQuiz(quizId, userId);

    const { score, gradedAnswers } = this.gradeSubmissions(
      quizQuestions,
      createReq.answers,
    );

    const submission = await this.submissionRepo.manager.transaction(
      async (manager) => {
        const newSubmission = manager.create(Submission, {
          user_id: userId,
          quiz_id: quizId,
          score: score,
          submitted_at: new Date(),
        });
        const savedSubmission = await this.submissionRepo.save(newSubmission);

        const submissionAnswers = createReq.answers.map((item) =>
          manager.create(SubmissionAnswers, {
            submission_id: savedSubmission.id,
            question_id: item.question_id,
            answers_id: item.answers_id,
          }),
        );
        await manager.save(submissionAnswers);

        return savedSubmission;
      },
    );

    return this.buildResult(submission, quizQuestions, gradedAnswers);
  }

  async getQuiz(quizId: string, userId: string) {
    const quiz = await this.quizRepo.findOne({
      where: { id: quizId },
      relations: ['course'],
    });

    if (!quiz) throw new NotFoundException('Not found this quiz');

    const enroll = await this.enrollRepo.findOne({
      where: {
        user_id: userId,
        course_id: quiz.course_id,
        status: EnrollmentStatus.active,
      },
    });

    if (!enroll) throw new ForbiddenException('You are not enroll that course');

    const questions = await this.questionRepo.find({
      where: { quiz_id: quizId },
      relations: ['answers'],
    });

    if (questions.length == 0)
      throw new BadRequestException('Quiz has no question');

    return questions;
  }

  private gradeSubmissions(
    questions: Question[],
    userAnswers: SubmissionAnswers[],
  ): { score: number; gradedAnswers: Map<string, string> } {
    const answeredMap = new Map(
      userAnswers.map((a) => [a.question_id, a.answers_id]),
    );

    let correctCount = 0;

    for (const question of questions) {
      const chosenAnswerId = answeredMap.get(question.id);
      if (!chosenAnswerId) continue;

      const chosenAnswer = question.answers.find(
        (a) => a.id === chosenAnswerId,
      );
      if (chosenAnswer?.is_correct) correctCount++;
    }

    const score = parseFloat(
      ((correctCount / questions.length) * 10).toFixed(2),
    );

    return { score: score, gradedAnswers: answeredMap };
  }

  private buildResult(
    submission: Submission,
    questions: Question[],
    answeredMap: Map<string, string>,
  ) {
    return {
      submission_id: submission.id,
      quiz_id: submission.quiz_id,
      score: submission.score,
      submitted_at: submission.submitted_at,
      total_questions: questions.length,
      detail: questions.map((q) => {
        const chosenAnswerId = answeredMap.get(q.id);
        const correctAnswer = q.answers.find((a) => a.is_correct);
        const chosenAnswer = q.answers.find((a) => a.id === chosenAnswerId);

        return {
          question_id: q.id,
          question_text: q.question_text,
          chosen_answer_id: chosenAnswerId ?? null,
          chosen_answer_text: chosenAnswer?.answer_text ?? null,
          correct_answer_id: correctAnswer?.id ?? null,
          correct_answer_text: correctAnswer?.answer_text ?? null,
          is_correct: chosenAnswer?.is_correct ?? false,
        };
      }),
    };
  }
}
// POST   /quizzes/:quizId/submissions        # student nộp bài
// GET    /quizzes/:quizId/submissions/my     # student xem bài của mình
// GET    /quizzes/:quizId/submissions        # instructor xem tất cả
// GET    /submissions/:id                    # chi tiết bài nộp + submission_answers
