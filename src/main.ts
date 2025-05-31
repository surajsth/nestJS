import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './../node_modules/@nestjs/config/node_modules/dotenv/lib/main.d';
import * as dotenv from 'dotenv'

// async function bootstrap() {
//   dotenv.config()
//   const app = await NestFactory.create(AppModule);
//   app.enableCors({
//     origin: true, //['http://localhost:3000']
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true
//   })
//   await app.listen(process.env.PORT ?? 5000);
// }
// bootstrap();


import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(5000);
}
bootstrap();
