import { resolve } from 'path';

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';

import { RootModule } from './module/root.module';

config({ path: resolve(__dirname, '../.env') });

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
    // TODO: add logging
    process.exit(1);
  });

  process.on('SIGINT', async () => {
    // TODO: add logging
    process.exit(1);
  });
}

function setupEventListers() {
  process.on('unhandledRejection', () => {
    // TODO: add logging
    process.exit(1);
  });

  process.on('uncaughtException', () => {
    // TODO: add logging
    process.exit(1);
  });

  process.on('error', () => {
    // TODO: add logging
    process.exit(1);
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
