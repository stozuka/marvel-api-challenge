import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { endpoint } from 'src/constant';

import { HealthCheckRespDto } from './dto';

@ApiTags('Health Check')
@Controller(endpoint.HEALTH_CHECK)
export class HealthCheckController {
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Check if the API is ready.',
    type: HealthCheckRespDto,
  })
  healthCheck(): HealthCheckRespDto {
    return { healthCheck: 'OK' };
  }
}
