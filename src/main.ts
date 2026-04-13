import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from 'src/common/filter/filter-exception.exception';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    creadential: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // config to use Exclude

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // del field undef
      forbidNonWhitelisted: true, // catch error for unknown field
      transform: true, // auto cover string to num
    }),
  );

  const config = app.get(ConfigService);
  const serverPort = config.get<number>('PORT');

  await app.listen(serverPort ?? 3000);
}
bootstrap();
