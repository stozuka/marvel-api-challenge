import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { redisConstant } from 'src/constant';
import { url, fetch } from 'src/util';

import { CharacterDto } from './dto/character.dto';

const CHARACTER_API_CONCURRENT = 10;
const CHARACTER_API_LIMIT = 100;

@Injectable()
export class MervelService {
  constructor(private readonly redisService: RedisService) {}

  /* To send multiple requests concurrently. */
  private createCharacterApiRequestPromises(offset: number) {
    const promises = [];
    const currOffset = offset;

    for (let i = 0; i < CHARACTER_API_CONCURRENT; i++) {
      const requestUrl = url.marvel.fetchCharactersUrl(Date.now(), {
        limit: CHARACTER_API_LIMIT,
        offset: currOffset + CHARACTER_API_LIMIT * i,
      });

      promises.push(fetch.withError(requestUrl));
    }

    return promises;
  }

  async fetchCharacterIds(): Promise<number[]> {
    const key = redisConstant.key.CHARACTER_IDS;
    const client = this.redisService.getClient();
    const newIds = [];
    let offset = await client.scard(key);

    while (true) {
      const responses = await Promise.all(
        this.createCharacterApiRequestPromises(offset),
      );
      const charactersList = responses.map((response) => response.data.results);
      const currIds = charactersList.flatMap((characters) =>
        characters.map((character: any) => character.id),
      );

      newIds.push(...currIds);

      /* If some of the response has no data, that means all the data are fetched. */
      if (charactersList.some((characters) => !characters.length)) {
        break;
      }

      offset += CHARACTER_API_CONCURRENT * CHARACTER_API_LIMIT;
    }

    if (newIds.length) {
      await client.sadd(key, newIds);
    }

    const characterIds = await client.smembers(key);

    return characterIds.map((characterId) => Number(characterId));
  }

  async fetchCharacter(characterId: number): Promise<CharacterDto> {
    const res = await fetch.withError(
      url.marvel.fetchCharacterUrl(characterId, Date.now()),
    );
    const { id, name, description } = res.data.results[0];

    return { id, name, description };
  }
}
