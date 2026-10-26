import {
    BadRequestException,
    Inject,
    Injectable,
} from "@nestjs/common"
import { ClientRepository } from "../../domain/repositories/ClientRepository"
import { CreateClientDTO } from "../dtos/create-client.dto"
import { Cliente } from "../../domain/entities/Cliente"

@Injectable()
export class CreateClientUseCase {
    constructor(
        @Inject("ClientRepository")
        private readonly clientRepository: ClientRepository,
    ) { }

    async execute(data: CreateClientDTO): Promise<Cliente> {
        const existingClient =
            await this.clientRepository.findClientByDocument(
                data.documento,
            )

        if (existingClient) {
            throw new BadRequestException(
                "A client with this document already exists.",
            )
        }

        const newClient = Cliente.create(
            data.nome,
            data.documento,
            data.telefone,
            data.email,
            data.endereco,
        )

        return this.clientRepository.save(newClient)
    }
}