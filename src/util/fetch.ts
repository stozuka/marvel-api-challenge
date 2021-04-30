import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import fetch, { RequestInit } from 'node-fetch';

export const withError = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  const status = res.status;

  if (status < 200 || status > 299) {
    const text = JSON.parse(await res.text());

    switch (status) {
      case 400:
        throw new BadRequestException(text);
      case 401:
        throw new UnauthorizedException(text);
      case 403:
        throw new ForbiddenException(text);
      case 404:
        throw new NotFoundException(text);
      case 500:
        throw new ServiceUnavailableException(text);
    }
  }

  return await res.json();
};
