import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { OrdemServicoRepository } from '../../domain/repositories/OrdemServicoRepository'

@Injectable()
export class GetOrderDetailsUseCase {
  constructor(
    @Inject('OrdemServicoRepository')
    private readonly ordemServicoRepository: OrdemServicoRepository,
  ) {}

  async execute(id: number) {
    const order = await this.ordemServicoRepository.findDetailsById(id)

    if (!order) {
      throw new NotFoundException(
        'Ordem de Serviço não encontrada.',
      )
    }

    return order
  }
}