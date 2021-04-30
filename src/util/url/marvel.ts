import * as crypto from 'crypto';

const BASE_URL = 'https://gateway.marvel.com';

export const fetchCharacterUrl = (characterId: number, ts: number) => {
  const publicKey = process.env.MARVEL_PUBLIC_KEY;
  const privateKey = process.env.MARVEL_PRIVATE_KEY;
  const hash = crypto
    .createHash('md5')
    .update(`${ts}${privateKey}${publicKey}`)
    .digest('hex');

  return `${BASE_URL}/v1/public/characters/${characterId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
};
