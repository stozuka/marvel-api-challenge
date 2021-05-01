import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { logger } from 'src/util';

import { CharacterDto } from './dto';
import { MervelService } from './marvel.service';

@ApiTags('Marvel')
@Controller('characters')
export class MarvelController {
  constructor(private readonly mervelService: MervelService) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Get all the character IDs.',
    schema: {
      type: 'array',
      example: [1010332, 1011028, 1011150],
      items: {
        type: 'number',
      },
    },
  })
  async getCharacterIds(): Promise<number[]> {
    try {
      return await this.mervelService.fetchCharacterIds();
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Get(':characterId')
  @ApiResponse({
    status: 200,
    description: 'Get a character.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Character not found.',
  })
  @ApiParam({
    name: 'characterId',
    required: true,
    description: 'Character ID',
    example: 1009146,
  })
  async getCharacter(
    @Param('characterId', ParseIntPipe) characterId: number,
  ): Promise<CharacterDto> {
    try {
      return await this.mervelService.fetchCharacter(characterId);
    } catch (error) {
      logger.error({ error, characterId });
      throw error;
    }
  }
}
