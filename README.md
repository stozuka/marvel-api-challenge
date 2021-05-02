![App CI](https://github.com/stozuka/marvel-api-challenge/actions/workflows/app.yaml/badge.svg)

# Marvel API Challenge

## Setup

1. Install Node.js

This app requires the version of `>=14.0.0`.

2. Install dependencies

```bash
npm i
```

3. Setup env variables

```bash
cp .env.example .env
```

4. Add values in .env

## Start the server in local

1. Start Redis

```bash
docker-compose up
```

2. Start the application server

- Watch mode

```bash
npm run start:dev
```

- Normal mode

```bash
npm run start
```

## Run the tests

- Unit test

```bash
npm run test
```

- E2E (integration) test

```bash
npm run test:e2e
```

## API doc

1. Start the server

2. Access `http://localhost:8080/api/`

To get the JSON data, access `http://localhost:8080/api-json`

## Build

- Build

```bash
npm run build
```

- Clean build

```bash
npm run build:clean
```

## Cache mechanism for /characters route

In `/characters` route, [/v1/public/characters](https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0) is called to fetch the character ID. The restriction is that this API allowed to fetch only 100 records at most in a single request. To fetch all of the IDs, more than 14 requests are needed as of May 2, 2021 since there are more than 1400 characters. To reduce the response time, cache is implemented in `/characters` route.

### Basic considerations

1. Use Redis as a cache store to make the server stateless. No cache data is stored inside the application server.
2. Use Redis Set data structure to avoid duplication caused by race condition considering there are multiple servers in the real environment.
3. Use `orderBy=modified,name` query to make sure the order of the character in the response from Marvel API is always the same. If a new character is added, it will be always at the last.
4. Use `offset` query to fetch the target chunk of the characters.
5. Use `limit=100` query to fetch the maximum number of characters for each request.

### Implemenation

1. Before each API call, MervelService fetches the number of character IDs stored in Redis. [SCARD](https://redis.io/commands/scard) is used.
2. Set the number of cached character ID as initial `offset`. For example, if there are already 100 character IDs in the cache, the next API call tries to fetch from 101 to 200.
3. Fetch until the response has no more data. If there is no data, it means all the characters are fetched.
4. Store into Redis cache. Only character ID is stored into the Set. [SADD](https://redis.io/commands/sadd) is used.
5. Fetch the character IDs from the cache and return. [SMEMBERS](https://redis.io/commands/smembers) is used.

### Performance optimization

1. If [/v1/public/characters](https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0) is called in serial form, it requires to `await` more than 14 times. But if multiple requests are sent concurrently, the number can be reduced, which results in less response time. For example, if 10 requests are sent concurrently by using `Promise.all`, it requires to `await` 2 times to fetch 1400+ characters assuming one request fetches 100 characters.
2. In MarvalService, the number of concurrent request is configured by `CHARACTER_API_CONCURRENT` to optimize the performance.
3. The above optimization has a drawback. Even after fetching all the characters and they are stored in cache, the `/characters` route still calls 10 requests to check if there are new characters if `CHARACTER_API_CONCURRENT` is set to 10. Because characters are not frequently added, most of the API call returns empty response. This would cause the waste of the machine and network resources.
4. `CHARACTER_API_CONCURRENT` can be set to 1 if very slow response time at the begining is allowed to save the resources in the subsequent requests. `CHARACTER_API_CONCURRENT` can be set to more than 1 if faster response time is required at the beginning with some waste of the resources in the subsequent requests.
