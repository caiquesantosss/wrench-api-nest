import { Test, TestingModule } from '@nestjs/testing';
import { OrdemServicoController } from './ordem-servico.controller';

describe('OrdemServicoController', () => {
  let controller: OrdemServicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdemServicoController],
    }).compile();

    controller = module.get<OrdemServicoController>(OrdemServicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
