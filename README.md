![App CI](https://github.com/stozuka/marvel-api-challenge/actions/workflows/app.yaml/badge.svg)

# Marvel API Challenge

## Setup

1. Install Node.js

This app requires the version of `>=14.0.0`.

2. Install dependencies

```bash
npm i
```

3. Setup husky pre-commit hook

```bash
npm run prepare
```

4. Setup env variables

```bash
cp .env.example .env
```

Add your values for all the keys.

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
