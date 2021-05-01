import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckModule } from 'src/module/health-check/health-check.module';
import * as request from 'supertest';

describe('health-check', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthCheckModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health-check (GET) success', () => {
    return request(app.getHttpServer())
      .get('/health-check')
      .expect(200)
      .expect({ healthCheck: 'OK' });
  });
});
