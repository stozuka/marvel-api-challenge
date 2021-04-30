import { Module } from '@nestjs/common';

import { MarvelController } from './marvel.controller';
import { MervelService } from './marvel.service';

@Module({
  controllers: [MarvelController],
  providers: [MervelService],
})
export class MarvelModule {}
