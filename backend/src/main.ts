import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // strip unknown properties
    forbidNonWhitelisted: true, // throw error on unknown props
    transform: true,       // transform payloads to DTO instances
  }));
  await app.listen(3000);
}
bootstrap();
