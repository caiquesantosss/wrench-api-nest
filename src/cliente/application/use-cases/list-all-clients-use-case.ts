import { Inject, Injectable } from "@nestjs/common";
import { ClientRepository } from "../../domain/repositories/ClientRepository";
import { Cliente } from "../../domain/entities/Cliente";

@Injectable()
export class ListAllClientsUseCase {
    constructor(
        @Inject('ClientRepository') 
        private readonly clientRepository: ClientRepository
    ) {}

    async execute(): Promise<Cliente[]>{
        return await this.clientRepository.listAll()
    }
}