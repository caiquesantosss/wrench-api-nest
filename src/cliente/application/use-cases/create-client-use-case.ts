import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ClientRepository } from "../../domain/repositories/ClientRepository";
import { CreateClientDto } from "../dtos/create-client.dto";
import { Cliente } from "../../domain/entities/Cliente";

@Injectable()
export class CreateClientUseCase {
    constructor(
        @Inject("ClientRepository")
        private readonly clientRepository: ClientRepository
    ) { }

    async execute(data: CreateClientDto): Promise<Cliente> {
        const existingClient = await this.clientRepository.findClientByDocument(
            data.documento
        )

        if (existingClient) {
            throw new BadRequestException('Cliente com este documento já existe!')
        }

        const newClient = Cliente.create(
            data.nome,
            data.documento, 
            data.telefone, 
            data.email, 
            data.endereco
        )

        return await this.clientRepository.saveCLient(newClient)
    }
}