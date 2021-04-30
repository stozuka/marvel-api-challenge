import { NotFoundException } from '@nestjs/common';
import { fetch } from 'src/util';

import { MervelService } from './marvel.service';

describe('MarvelServe', () => {
  let mervelService: MervelService;

  beforeEach(() => {
    mervelService = new MervelService();
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
