import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { QuestionType } from 'src/common/enums/question-type.enum';
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
import { SubmissionAnswer } from './entities/submission-answer.entity';
import { Submission } from './entities/submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(SubmissionAnswer)
    private readonly submissionAnswerRepo: Repository<SubmissionAnswer>,
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
          score,
          submitted_at: new Date(),
        });

        const savedSubmission = await manager.save(newSubmission);

        const submissionAnswers = createReq.answers.flatMap((item) =>
          item.answers_id.map((answerId) =>
            manager.create(SubmissionAnswer, {
              submission_id: savedSubmission.id,
              question_id: item.question_id,
              answer_id: answerId,
            }),
          ),
        );

        await manager.save(submissionAnswers);

        return savedSubmission;
      },
    );

    return this.buildResult(submission, quizQuestions, gradedAnswers);
  }

  async getMySubmission(quizId: string, userId: string) {
    const quiz = await this.quizRepo.findOne({
      where: { id: quizId },
      relations: ['course'],
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    const enroll = await this.enrollRepo.findOne({
      where: {
        user_id: userId,
        course_id: quiz.course_id,
        status: EnrollmentStatus.active,
      },
    });

    if (!enroll)
      throw new ForbiddenException('You are not enrolled in this course');

    const submission = await this.submissionRepo.findOne({
      where: { quiz_id: quizId, user_id: userId },
      relations: [
        'submission_answers',
        'submission_answers.question',
        'submission_answers.answer',
      ],
      order: { submitted_at: 'DESC' },
    });

    if (!submission) throw new NotFoundException('Submission not found');

    const questions = await this.questionRepo.find({
      where: { quiz_id: quizId },
      relations: ['answers'],
      order: { order_index: 'ASC' },
    });

    const answeredMap = new Map<string, string[]>();

    submission.submission_answers.forEach((answer) => {
      const existing = answeredMap.get(answer.question_id) ?? [];
      answeredMap.set(answer.question_id, [...existing, answer.answer_id]);
    });

    return this.buildResult(submission, questions, answeredMap);
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

    if (!enroll)
      throw new ForbiddenException('You are not enrolled in this course');

    const questions = await this.questionRepo.find({
      where: { quiz_id: quizId },
      relations: ['answers'],
      order: { order_index: 'ASC' },
    });

    if (questions.length === 0)
      throw new BadRequestException('Quiz has no question');

    return questions;
  }

  private gradeSubmissions(
    questions: Question[],
    userAnswers: SubmissionAnswers[],
  ): { score: number; gradedAnswers: Map<string, string[]> } {
    const answeredMap = new Map(
      userAnswers.map((a) => [a.question_id, a.answers_id]),
    );

    let correctCount = 0;

    for (const question of questions) {
      const selectedAnswers = new Set(answeredMap.get(question.id) ?? []);
      const correctAnswerIds = question.answers
        .filter((answer) => answer.is_correct)
        .map((answer) => answer.id);
      const correctAnswerSet = new Set(correctAnswerIds);

      if (selectedAnswers.size === 0) continue;

      const isCorrect =
        selectedAnswers.size === correctAnswerSet.size &&
        [...selectedAnswers].every((answerId) =>
          correctAnswerSet.has(answerId),
        );

      if (question.type === QuestionType.single && selectedAnswers.size !== 1)
        continue;

      if (isCorrect) correctCount++;
    }

    const score = parseFloat(
      ((correctCount / questions.length) * 10).toFixed(2),
    );

    return { score, gradedAnswers: answeredMap };
  }

  private buildResult(
    submission: Submission,
    questions: Question[],
    answeredMap: Map<string, string[]>,
  ) {
    return {
      submission_id: submission.id,
      quiz_id: submission.quiz_id,
      score: submission.score,
      submitted_at: submission.submitted_at,
      total_questions: questions.length,
      detail: questions.map((question) => {
        const selectedIds = new Set(answeredMap.get(question.id) ?? []);
        const selectedAnswers = question.answers
          .filter((answer) => selectedIds.has(answer.id))
          .map((answer) => ({
            id: answer.id,
            answer_text: answer.answer_text,
          }));

        const correctAnswers = question.answers
          .filter((answer) => answer.is_correct)
          .map((answer) => ({
            id: answer.id,
            answer_text: answer.answer_text,
          }));

        const isCorrect =
          selectedAnswers.length > 0 &&
          selectedAnswers.length === correctAnswers.length &&
          selectedAnswers.every((selected) =>
            correctAnswers.some((correct) => correct.id === selected.id),
          );

        return {
          question_id: question.id,
          question_text: question.question_text,
          selected_answers: selectedAnswers,
          correct_answers: correctAnswers,
          is_correct: isCorrect,
        };
      }),
    };
  }
}
// POST   /quizzes/:quizId/submissions        # student nộp bài
// GET    /quizzes/:quizId/submissions/my     # student xem bài của mình
// GET    /quizzes/:quizId/submissions        # instructor xem tất cả
// GET    /submissions/:id                    # chi tiết bài nộp + submission_answers
