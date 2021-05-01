import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import fetch, { RequestInit } from 'node-fetch';
import { logger } from 'src/util';

export const withError = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  const statusCode = res.status;

  if (statusCode < 200 || statusCode > 299) {
    const text = JSON.parse(await res.text());

    logger.info({
      message: 'fetch failed',
      url,
      options,
      statusCode,
      text,
    });

    switch (statusCode) {
      case 400:
        throw new BadRequestException(text);
      case 401:
        throw new UnauthorizedException(text);
      case 403:
        throw new ForbiddenException(text);
      case 404:
        throw new NotFoundException(text);
      case 429:
        throw new HttpException(text, 429);
      default:
        throw new ServiceUnavailableException(text);
    }
  }

  return await res.json();
};
