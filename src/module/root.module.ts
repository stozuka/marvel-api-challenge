import { Module } from '@nestjs/common';

import { HealthCheckModule } from './health-check/health-check.module';
import { MarvelModule } from './marvel/marvel.module';

@Module({
  imports: [HealthCheckModule, MarvelModule],
})
export class RootModule {}
