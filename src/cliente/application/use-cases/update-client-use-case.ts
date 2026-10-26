import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientRepository } from "../../domain/repositories/ClientRepository";
import { Cliente } from "../../domain/entities/Cliente";
import { CreateClientDTO } from "../dtos/create-client.dto";

@Injectable()
export class UpdateClientUseCase {
    constructor(
        @Inject('ClientRepository')
        private readonly clientRepository: ClientRepository
    ) { }

    async execute(id_cliente: number, data: CreateClientDTO): Promise<Cliente> {
        const existsClient = await this.clientRepository.findClientById(
            id_cliente
        )

        if (!existsClient) {
            throw new NotFoundException(
                'Cliente não foi encontrado.'
            )
        }

        existsClient.updateDetails(
            data.nome,
            data.documento,
            data.endereco,
            data.email,
            data.telefone
        )

        return await this.clientRepository.save(existsClient)
    }
}