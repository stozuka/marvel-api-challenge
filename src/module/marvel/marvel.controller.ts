import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { logger } from 'src/util';

import { CharacterDto } from './dto/character.dto';
import { MervelService } from './marvel.service';

@ApiTags('Marvel')
@Controller()
export class MarvelController {
  constructor(private readonly mervelService: MervelService) {}

  @Get('characters/:characterId')
  @ApiResponse({
    status: 200,
    description: 'Get a character.',
    type: CharacterDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Character not found.',
  })
  @ApiParam({
    name: 'characterId',
    required: true,
    description: 'Character ID',
    example: 10000,
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
