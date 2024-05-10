import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())  

  const config_service = new ConfigService()

  const PORT = config_service.get<number>("PORT");

  console.log(PORT);
  

  await app.listen(PORT);
}
bootstrap();
