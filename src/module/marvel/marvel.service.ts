import { Injectable } from '@nestjs/common';
import { url, fetch } from 'src/util';

import { CharacterDto } from './dto/character.dto';

@Injectable()
export class MervelService {
  async fetchCharacter(characterId: number): Promise<CharacterDto> {
    const res = await fetch.withError(
      url.marvel.fetchCharacterUrl(characterId, Date.now()),
    );
    const { id, name, description } = res.data.results[0];

    return { id, name, description };
  }
}
