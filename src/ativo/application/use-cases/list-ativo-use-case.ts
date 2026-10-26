import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { AtivoRepository } from "../../domain/repositories/AtivoRepository"
import { Ativo } from "../../domain/entities/ativo"
import { ClientRepository } from "../../../cliente/domain/repositories/ClientRepository"

@Injectable()
export class ListAtivoUseCase {
    constructor(
        @Inject('AtivoRepository')
        private readonly ativoRepository: AtivoRepository,

        @Inject('ClientRepository')
        private readonly clientRepository: ClientRepository
    ) {}

    async execute(id_cliente: number): Promise<Ativo[]> {
        const clientExistis = await this.clientRepository.findClientById(
            id_cliente
        )

        if (!clientExistis) {
            throw new NotFoundException(
                'O cliente não pode ser encontrado.'
            )
        }

        return await this.ativoRepository.listByClient(id_cliente)
    }
}