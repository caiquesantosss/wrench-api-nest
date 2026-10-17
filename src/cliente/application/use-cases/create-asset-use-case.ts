import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Ativo } from '../../domain/entities/Ativo';
import { ClientRepository } from '../../domain/repositories/ClientRepository';
import { CreateAssetDto } from '../../application/dtos/create-asset.dto'

@Injectable()
export class CreateAssetUseCase {
    constructor(
        @Inject('ClientRepository')
        private readonly clienteRepository: ClientRepository
    ) { }

    async execute(data: CreateAssetDto): Promise<Ativo> {

        const client = await this.clienteRepository
                     .findClientById(data.id_cliente)

        if (!client) {
            throw new NotFoundException(
                'Client not found. Cannot register asset.'
            )
        }

        const newAssetEntity = Ativo.create(
            data.id_cliente,
            data.descricao,
            data.tipo,
            data.marca,
            data.modelo,
            data.identificacao,
            data.observacoes
        );

        return await this.clienteRepository.saveAtivo(newAssetEntity);
    }
}