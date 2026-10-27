import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientRepository } from "../../domain/repositories/ClientRepository";
import { Cliente } from "../../domain/entities/Cliente";

@Injectable()
export class ToggleStatusClientUseCase {
    constructor(
        @Inject('ClientRepository')
        private clientRepository: ClientRepository
    ) { }

    async execute(id_cliente: number): Promise<Cliente> {
        const existsCliente = await this.clientRepository.findClientById(
            id_cliente
        )

        if (!existsCliente) {
            throw new NotFoundException(
                'Não foi possível encontrar um ativo.'
            )
        }
        
        existsCliente.toggleStatus()

        return await this.clientRepository.save(existsCliente)
    }
}