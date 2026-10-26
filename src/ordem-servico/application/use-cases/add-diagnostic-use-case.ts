import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { OrdemServicoRepository } from "../../domain/repositories/OrdemServicoRepository"
import { OrdemServico } from "../../domain/entities/OrdemServico"

@Injectable()
export class AddDiagnosticUseCase {
    constructor(
        @Inject('OrdemServicoRepository')
        private readonly osRepository: OrdemServicoRepository
    ) {}

    async execute(id_os: number, diagnostico: string): Promise<OrdemServico> {
        const os = await this.osRepository.findById(id_os)

        if (!os) {
            throw new NotFoundException(
                `Ordem de serviço com ID ${id_os} não foi encontrada!` 
            )
        }

        os.setDiagnosis(diagnostico)

        return await this.osRepository.save(os)
    }
}