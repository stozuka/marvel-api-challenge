import { ApiProperty } from '@nestjs/swagger';

export class CharacterDto {
  @ApiProperty({
    type: Number,
    description: 'ID',
    example: 10000,
  })
  id: number;
  @ApiProperty({
    type: String,
    description: 'Name',
    example: '3-D Man',
  })
  name: string;
  @ApiProperty({
    type: String,
    description: 'Description',
    example: 'description',
  })
  description: string;
}
