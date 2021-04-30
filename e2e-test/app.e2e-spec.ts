import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { HealthCheckModule } from '../src/module/health-check/health-check.module';

describe('Health check controller', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthCheckModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health-check (GET) success', () => {
    return request(app.getHttpServer())
      .get('/health-check')
      .expect(200)
      .expect({ healthCheck: 'OK' });
  });
});
