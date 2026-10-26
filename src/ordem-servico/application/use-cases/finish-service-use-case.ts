import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { OrdemServicoRepository } from "../../domain/repositories/OrdemServicoRepository"
import { OrdemServico } from "../../domain/entities/OrdemServico"
import { FinishServiceDTO } from "../dtos/finish-service.dto"

@Injectable()
export class FinishServiceUseCase {
    constructor(
        @Inject('OrdemServicoRepository')
        private readonly osRepository: OrdemServicoRepository
    ) { }

    async execute(id_os: number, dados: FinishServiceDTO): Promise<OrdemServico> {
        const os = await this.osRepository.findById(id_os)

        if (!os) {
            throw new NotFoundException(
                `Ordem de serviço com o ID ${id_os} não foi encontrada!`
            )
        }

        os.completeService(dados.solucao_aplicada)

        return await this.osRepository.save(os)
    }
}

