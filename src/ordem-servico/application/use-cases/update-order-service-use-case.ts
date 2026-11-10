
import { Injectable, Inject } from '@nestjs/common'

import { OrdemServicoRepository } from '../../domain/repositories/OrdemServicoRepository'
import { UpdateOrderServicoDTO } from '../dtos/update-order-service.dto'

@Injectable()
export class UpdateOrdemServicoUseCase {
    constructor(
        @Inject('OrdemServicoRepository')
        private readonly ordemServicoRepository: OrdemServicoRepository
    ) { }

    async execute(
        id: number,
        data: UpdateOrderServicoDTO
    ) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Identificador da Ordem de Serviço inválido.')
        }

        const ordemServico =
            await this.ordemServicoRepository.findById(id)

        if (!ordemServico) {
            throw new Error('Ordem de Serviço não encontrada.')
        }

        const dataPrevisao = data.data_previsao
            ? new Date(data.data_previsao)
            : null

        ordemServico.updateBasicInformation(
            data.id_cliente,
            data.id_ativo,
            data.descricao_problema,
            dataPrevisao
        )

        return this.ordemServicoRepository.save(ordemServico)
    }
}
