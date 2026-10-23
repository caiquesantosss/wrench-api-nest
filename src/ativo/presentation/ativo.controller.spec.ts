import { Test, TestingModule } from '@nestjs/testing';
import { AtivoController } from './ativo.controller';

describe('AtivoController', () => {
  let controller: AtivoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtivoController],
    }).compile();

    controller = module.get<AtivoController>(AtivoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
