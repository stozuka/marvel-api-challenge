import { NestFactory } from '@nestjs/core';

import { RootModule } from './module/root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  await app.listen(8080);
}
bootstrap();
