import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('AppBootstrap');
const DEFAULT_APP_PORT = 4000;
const DEFAULT_APP_HOST = 'localhost';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || DEFAULT_APP_PORT;
  const hostname = configService.get('HOST') || DEFAULT_APP_HOST;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, hostname, () =>
    logger.log(`Server running at ${hostname}:${port}`),
  );
}
bootstrap();
