import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';

import { MarvelController } from './marvel.controller';
import { MervelService } from './marvel.service';

@Module({
  imports: [
    RedisModule.register({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6380,
    }),
  ],
  controllers: [MarvelController],
  providers: [MervelService],
})
export class MarvelModule {}
