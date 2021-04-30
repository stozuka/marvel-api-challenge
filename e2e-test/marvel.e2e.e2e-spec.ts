import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as nock from 'nock';
import * as request from 'supertest';

import { MarvelModule } from './../src/module/marvel/marvel.module';

describe('marvel', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MarvelModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('/characters/:characterId (GET) success', () => {
    const characterId = 1;
    const expected = {
      id: 1,
      name: 'name',
      description: 'description',
    };
    const mockRes = {
      data: {
        results: [expected],
      },
    };

    nock('https://gateway.marvel.com')
      .get(`/v1/public/characters/${characterId}`)
      .query(true)
      .reply(200, mockRes);

    return request(app.getHttpServer())
      .get(`/characters/${characterId}`)
      .expect(200)
      .expect(expected);
  });

  it('/characters/:characterId (GET) Not found error', () => {
    const characterId = 1;
    const mockRes = {};

    nock('https://gateway.marvel.com')
      .get(`/v1/public/characters/${characterId}`)
      .query(true)
      .reply(404, mockRes);

    return request(app.getHttpServer())
      .get(`/characters/${characterId}`)
      .expect(404);
  });
});
