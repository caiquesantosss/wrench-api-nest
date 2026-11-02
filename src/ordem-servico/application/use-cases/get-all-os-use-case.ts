import { Inject } from "@nestjs/common";
import { OrdemServicoRepository } from "../../domain/repositories/OrdemServicoRepository";
import { OrdemServicoListagemDTO } from "../dtos/list-all-os.dto";

export class GetAllOSUseCase {
    constructor(
        @Inject('OrdemServicoRepository')
        private readonly ordemServicoRepository: OrdemServicoRepository
    ) {}

    async execute(): Promise<OrdemServicoListagemDTO[]> {
        const osList = await this.ordemServicoRepository.listAll()
        return osList
    }
}