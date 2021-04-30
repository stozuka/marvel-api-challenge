import { Test, TestingModule } from '@nestjs/testing';

import { HealthCheckController } from './health-check.controller';

describe('HealthCheckController', () => {
  let controller: HealthCheckController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
    }).compile();

    controller = app.get<HealthCheckController>(HealthCheckController);
  });

  describe('root', () => {
    it('should return success response', () => {
      const expected = {
        healthCheck: 'OK',
      };

      expect(controller.healthCheck()).toEqual(expected);
    });
  });
});
