import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    //Whitelist let only the properties that are defined in the DTO
    whitelist: true,
  }),
  );
  await app.listen(3333);
}
bootstrap();
