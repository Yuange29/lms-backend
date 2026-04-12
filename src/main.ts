import cookieParser from 'cookie-parser';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    creadential: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // del field undef
      forbidNonWhitelisted: true, // catch error for unknown field
      transform: true, // auto cover string to num
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
