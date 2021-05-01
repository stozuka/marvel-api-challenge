import * as crypto from 'crypto';

const BASE_URL = 'https://gateway.marvel.com/v1/public';

const getHash = (ts: number) => {
  return crypto
    .createHash('md5')
    .update(
      `${ts}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`,
    )
    .digest('hex');
};

export const fetchCharactersUrl = (
  ts: number,
  options: Record<string, number>,
) => {
  const url = new URL(`${BASE_URL}/characters`);

  url.searchParams.append('ts', String(ts));
  url.searchParams.append('apikey', process.env.MARVEL_PUBLIC_KEY);
  url.searchParams.append('hash', getHash(ts));
  url.searchParams.append('orderBy', 'modified,name');

  if (options.limit) {
    url.searchParams.append('limit', String(options.limit));
  }

  if (options.offset) {
    url.searchParams.append('offset', String(options.offset));
  }

  return url.toString();
};

export const fetchCharacterUrl = (characterId: number, ts: number) => {
  const url = new URL(`${BASE_URL}/characters/${characterId}`);

  url.searchParams.append('ts', String(ts));
  url.searchParams.append('apikey', process.env.MARVEL_PUBLIC_KEY);
  url.searchParams.append('hash', getHash(ts));

  return url.toString();
};
