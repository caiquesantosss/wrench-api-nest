import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { OrdemServicoRepository } from "../../domain/repositories/OrdemServicoRepository"
import { ClientRepository } from "../../../cliente/domain/repositories/ClientRepository"
import { OpenOsDTO } from "../dtos/open-os.dto"
import { OrdemServico } from "../../domain/entities/OrdemServico"
import { AtivoRepository } from "../../../ativo/domain/repositories/AtivoRepository"

@Injectable()
export class OpenServiceOrderUseCase {
    constructor(
        @Inject('OrdemServicoRepository')
        private readonly osRepository: OrdemServicoRepository,

        @Inject('AtivoRepository') 
        private readonly ativoRepository: AtivoRepository,

        @Inject('ClientRepository') 
        private readonly clientRepository: ClientRepository
    ) { }

    async execute(data: OpenOsDTO, id_usuario_logado: number): Promise<OrdemServico> {

        const client = await this.clientRepository.findClientById(
            data.id_cliente
        )

        if (!client) {
            throw new NotFoundException('Cliente não encontrado')
        }

        const ativosDoCliente = await this.ativoRepository.listByClient(
            data.id_cliente
        )

        const ativoValido = ativosDoCliente.find(
            a => a.id_ativo === data.id_ativo
        )

        if (!ativoValido) {
            throw new NotFoundException(
                'O veículo/máquina selecionado não pertence a este cliente ou não existe.'
            )
        }

        const newOs = OrdemServico.create(
            data.id_cliente,
            data.id_ativo,
            id_usuario_logado, 
            data.descricao_problema
        )

        return await this.osRepository.save(newOs)
    }
}