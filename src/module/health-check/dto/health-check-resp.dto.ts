import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckRespDto {
  @ApiProperty({
    type: String,
    description: 'OK if the server is up and running.',
    example: 'OK',
  })
  healthCheck: string;
}
