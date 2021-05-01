import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from 'nestjs-redis';
import * as nock from 'nock';
import { MARVEL_BASE_URL } from 'src/constant/endpoint-constant';
import * as request from 'supertest';

import { MarvelModule } from '../src/module/marvel/marvel.module';

describe('marvel', () => {
  const scard = jest.fn();
  const sadd = jest.fn();
  const smembers = jest.fn();
  const redisService = ({
    getClient: () => {
      return {
        scard,
        sadd,
        smembers,
      };
    },
  } as unknown) as RedisService;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MarvelModule],
    })
      .overrideProvider(RedisService)
      .useValue(redisService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(() => {
    scard.mockClear();
    sadd.mockClear();
    smembers.mockClear();
    nock.cleanAll();
  });

  describe('GET /characters', () => {
    it('should return success response', () => {
      const mockRes = {
        data: {
          results: [
            {
              id: 1,
            },
          ],
        },
      };
      const mockEmptyRes = {
        data: {
          results: [],
        },
      };

      scard.mockReturnValue(0);
      smembers.mockReturnValue(['1']);

      nock(MARVEL_BASE_URL).get('/characters').query(true).reply(200, mockRes);

      nock(MARVEL_BASE_URL)
        .persist()
        .get('/characters')
        .query(true)
        .reply(200, mockEmptyRes);

      return request(app.getHttpServer())
        .get('/characters')
        .expect(200)
        .expect([1]);
    });

    it('should return 503 when Marvel api is not available', () => {
      nock(MARVEL_BASE_URL)
        .persist()
        .get('/characters')
        .query(true)
        .reply(500, {});

      return request(app.getHttpServer()).get('/characters').expect(503);
    });
  });

  describe('GET /characters/:characterId', () => {
    it('should return success response', () => {
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

      nock(MARVEL_BASE_URL)
        .persist()
        .get(`/characters/${characterId}`)
        .query(true)
        .reply(200, mockRes);

      return request(app.getHttpServer())
        .get(`/characters/${characterId}`)
        .expect(200)
        .expect(expected);
    });

    it('should reutrn 404 when character not found', () => {
      const characterId = 1;

      nock(MARVEL_BASE_URL)
        .persist()
        .get(`/characters/${characterId}`)
        .query(true)
        .reply(404, {});

      return request(app.getHttpServer())
        .get(`/characters/${characterId}`)
        .expect(404);
    });
  });
});
