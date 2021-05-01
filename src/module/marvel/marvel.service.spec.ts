import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { fetch } from 'src/util';

import { MervelService } from './marvel.service';

describe('MarvelServe', () => {
  const scard = jest.fn();
  const sadd = jest.fn();
  const smembers = jest.fn();
  let mervelService: MervelService;
  let redisService: RedisService;

  beforeEach(() => {
    redisService = ({
      getClient: () => {
        return {
          scard,
          sadd,
          smembers,
        };
      },
    } as unknown) as RedisService;
    mervelService = new MervelService(redisService);
  });

  afterEach(() => {
    scard.mockClear();
    sadd.mockClear();
    smembers.mockClear();
  });

  describe('fetchCharacterIds', () => {
    it('should return success response', async () => {
      scard.mockReturnValue(0);
      smembers.mockReturnValue(['1']);

      jest
        .spyOn(fetch, 'withError')
        .mockResolvedValueOnce({
          data: {
            results: [1],
          },
        })
        .mockResolvedValue({
          data: {
            results: [],
          },
        });

      const result = await mervelService.fetchCharacterIds();

      expect(result).toEqual([1]);
    });

    it('should throw an error when fetch data failed', async () => {
      scard.mockReturnValue(0);
      smembers.mockReturnValue(['1']);

      jest
        .spyOn(fetch, 'withError')
        .mockRejectedValue(new InternalServerErrorException());

      try {
        await mervelService.fetchCharacter(1);

        fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('fetchCharacter', () => {
    it('should return success response', async () => {
      const expected = {
        id: 1,
        name: 'name',
        description: 'description',
      };
      const res = {
        data: {
          results: [expected],
        },
      };

      jest.spyOn(fetch, 'withError').mockResolvedValue(res);

      const result = await mervelService.fetchCharacter(1);

      expect(result).toEqual(expected);
    });
  });

  it('should throw an error when fetch data failed', async () => {
    jest.spyOn(fetch, 'withError').mockRejectedValue(new NotFoundException());

    try {
      await mervelService.fetchCharacter(1);

      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
