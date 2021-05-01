import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

import { MarvelController } from './marvel.controller';
import { MervelService } from './marvel.service';

describe('MarvelController', () => {
  let marvelController: MarvelController;
  let mervelService: MervelService;

  beforeEach(() => {
    mervelService = new MervelService({} as RedisService);
    marvelController = new MarvelController(mervelService);
  });

  describe('getCharacterIds', () => {
    it('should return success response', async () => {
      const expected = [1, 2, 3];

      jest
        .spyOn(mervelService, 'fetchCharacterIds')
        .mockResolvedValue(expected);

      const result = await marvelController.getCharacterIds();

      expect(result).toEqual(expected);
    });

    it('should throw an error when fetch data failed', async () => {
      jest
        .spyOn(mervelService, 'fetchCharacterIds')
        .mockRejectedValue(new InternalServerErrorException());

      try {
        await marvelController.getCharacterIds();

        fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('getCharacter', () => {
    it('should return success response', async () => {
      const expected = {
        id: 1,
        name: 'name',
        description: 'description',
      };

      jest.spyOn(mervelService, 'fetchCharacter').mockResolvedValue(expected);

      const result = await marvelController.getCharacter(1);

      expect(result).toEqual(expected);
    });
  });

  it('should throw an error when fetch data failed', async () => {
    jest
      .spyOn(mervelService, 'fetchCharacter')
      .mockRejectedValue(new NotFoundException());

    try {
      await marvelController.getCharacter(1);

      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
