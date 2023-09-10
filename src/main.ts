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
  const port = process.env.PORT || 3333;
  await app.listen(port);
  console.log("Server running on port: ", port)
}
bootstrap();
