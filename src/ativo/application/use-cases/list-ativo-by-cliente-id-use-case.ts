import { AtivoRepository } from "../../domain/repositories/AtivoRepository"
import { Ativo } from "../../../ativo/domain/entities/ativo"
import { Inject } from "@nestjs/common"

interface ListAtivosByIdClienteUseCaseRequest {
    id_cliente: number
}

interface ListAtivosByIdClienteUseCaseResponse {
    ativos: Ativo[]
}

export class ListAtivosByIdClienteUseCase {
    constructor(
        @Inject('AtivoRepository')
        private ativoRepository: AtivoRepository
    ) { }

    async execute({
        id_cliente,
    }: ListAtivosByIdClienteUseCaseRequest): Promise<ListAtivosByIdClienteUseCaseResponse> {
        const ativos = await this.ativoRepository.listByClient(id_cliente)

        return {
            ativos,
        }
    }
}