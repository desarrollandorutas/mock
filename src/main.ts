import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/env';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('inter-rider-service');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  await app.listen(envs.port);
  logger.log(`running on port ${envs.port}`)
}
bootstrap();
