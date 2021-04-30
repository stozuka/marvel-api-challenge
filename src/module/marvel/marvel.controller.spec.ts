import { NotFoundException } from '@nestjs/common';

import { MarvelController } from './marvel.controller';
import { MervelService } from './marvel.service';

describe('MarvelController', () => {
  let marvelController: MarvelController;
  let mervelService: MervelService;

  beforeEach(() => {
    mervelService = new MervelService();
    marvelController = new MarvelController(mervelService);
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
