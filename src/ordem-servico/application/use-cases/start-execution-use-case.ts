import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrdemServicoRepository } from "../../domain/repositories/OrdemServicoRepository";
import { OrdemServico } from "../../domain/entities/OrdemServico";

@Injectable()
export class StartExecutionUseCase {
    constructor(
        @Inject('OrdemServicoRepository')
        private readonly osRepository: OrdemServicoRepository
    ) { }

    async execute(id_os: number): Promise<OrdemServico> {
        const os = await this.osRepository.findById(id_os)

        if (!os) {
            throw new NotFoundException(
                `Ordem de serviço com o ID ${id_os} não foi encontrada!`
            )
        }

        os.startExecution()

        return await this.osRepository.save(os)
    }
}