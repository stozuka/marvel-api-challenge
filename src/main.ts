import { resolve } from 'path';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';

import { RootModule } from './module/root.module';
import { logger } from './util';

config({ path: resolve(__dirname, '../../.env') });

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Marvel API Challenge')
    .setDescription('App to fetch chracter data from Marvel API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
}

function setupSignalHandlers() {
  process.on('SIGTERM', async () => {
    logger.info({ message: 'SIGTERM received: exit with 0' });
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.info({ message: 'SIGINT received: exit with 0' });
    process.exit(0);
  });
}

function setupEventListers() {
  process.on('unhandledRejection', (reason, at) => {
    logger.error({
      message: 'unhandledRejection: exit with 1',
      reason,
      at,
    });
    process.exit(1);
  });

  process.on('uncaughtException', (error: any, origin: any) => {
    logger.error({ message: 'uncaughtException: exit with 1', error, origin });
    process.exit(1);
  });

  process.on('warning', (warning) => {
    logger.warn({ message: 'warning detected', warning });
  });
}

async function bootstrap() {
  setupSignalHandlers();
  setupEventListers();

  const app = await NestFactory.create(RootModule);

  setupSwagger(app);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
