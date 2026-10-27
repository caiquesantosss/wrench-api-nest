import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { OrdemServicoRepository } from "../../domain/repositories/OrdemServicoRepository"
import { BudgetDefineDTO } from "../dtos/budget-define.dto"
import { OrdemServico } from "../../domain/entities/OrdemServico"

@Injectable()
export class BudgetDefineUseCase {
    constructor(
        @Inject('OrdemServicoRepository')
        private readonly osRepository: OrdemServicoRepository
    ) { }

    async execute(id_os: number, data: BudgetDefineDTO): Promise<OrdemServico> {
        const os = await this.osRepository.findById(id_os)

        if (!os) {
            throw new NotFoundException(
                `Ordem de serviço com o ID ${id_os} não foi encontrada!`
            )
        }

        let dataPrevista: Date | undefined
        if (data.data_previsao) {
            dataPrevista = new Date(data.data_previsao)
        }

        os.setBudget(data.valor_mao_obra, dataPrevista)


        return await this.osRepository.save(os)
    }
}