import cookieParser from 'cookie-parser';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    creadential: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // config to use Exclude

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
