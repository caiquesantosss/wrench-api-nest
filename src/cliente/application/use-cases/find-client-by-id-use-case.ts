import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientRepository } from "../../domain/repositories/ClientRepository";
import { Cliente } from "../../domain/entities/Cliente";

@Injectable() 
export class FindCLientById {
    constructor(
        @Inject('ClientRepository') 
        private readonly clientRepository: ClientRepository
    ) {}

    async execute(id_cliente: number): Promise<Cliente> {
        const existsClient = await this.clientRepository.findClientById(
            id_cliente
        )

        if (!existsClient) {
            throw new NotFoundException(
                'O cliente não pode ser encontrado'
            )
        }

        return existsClient
    }
}