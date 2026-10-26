import { Test, TestingModule } from '@nestjs/testing'
import { CatalogoItemController } from './catalogo-item.controller'

describe('CatalogoItemController', () => {
  let controller: CatalogoItemController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogoItemController],
    }).compile()

    controller = module.get<CatalogoItemController>(CatalogoItemController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
