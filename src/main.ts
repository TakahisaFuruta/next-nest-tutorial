import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true, // frontとbackのやり取りの認証をcookieベースのjwtで行うのでtrue
    origin: ['http://localhost:3000', 'https://next-todo-sample.vercel.app'], // next側からのアクセスを許可
  });
  app.use(cookieParser());
  await app.listen(3005);
}
bootstrap();
