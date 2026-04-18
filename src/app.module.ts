import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswersModule } from './answers/answers.module';
import { Answer } from './answers/entities/answer.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { OwnershipGuard } from './common/guards/owner-check.guard';
import { SeedModule } from './config/seed.module';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { Lesson } from './lessons/entities/lesson.entity';
import { LessonsModule } from './lessons/lessons.module';
import { ProgressModule } from './progress/progress.module';
import { Question } from './questions/entities/question.entity';
import { QuestionsModule } from './questions/questions.module';
import { Quiz } from './quizzes/entities/quiz.entity';
import { QuizzesModule } from './quizzes/quizzes.module';
import { Section } from './sections/entities/section.entity';
import { SectionsModule } from './sections/sections.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_POST'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts, .js}'],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Course, Section, Lesson, Quiz, Question, Answer]),
    UsersModule,
    AuthModule,
    SeedModule,
    CoursesModule,
    SectionsModule,
    LessonsModule,
    EnrollmentsModule,
    ProgressModule,
    QuizzesModule,
    QuestionsModule,
    AnswersModule,
    SubmissionsModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, OwnershipGuard],
})
export class AppModule {}
