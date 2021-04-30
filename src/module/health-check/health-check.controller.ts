import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {
  @Get()
  healthCheck(): Record<string, string> {
    return { healthCheck: 'OK' };
  }
}
