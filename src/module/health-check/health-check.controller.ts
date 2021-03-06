import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { endpointConstant } from 'src/constant';

import { HealthCheckRespDto } from './dto';

@ApiTags('Health Check')
@Controller(endpointConstant.HEALTH_CHECK)
export class HealthCheckController {
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Check if the API is ready.',
    schema: {
      type: 'object',
      properties: {
        healthCheck: {
          type: 'string',
        },
      },
    },
  })
  healthCheck(): HealthCheckRespDto {
    return { healthCheck: 'OK' };
  }
}
