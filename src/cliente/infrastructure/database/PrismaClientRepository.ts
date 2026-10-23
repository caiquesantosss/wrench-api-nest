import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { Cliente } from "../../domain/entities/Cliente"
import { ClientRepository } from "../../domain/repositories/ClientRepository"

@Injectable()
export class PrismaClientRepository implements ClientRepository {
    constructor(private readonly prisma: PrismaService) {}

    async saveCLient(cliente: Cliente): Promise<Cliente> {
        const datas = {
            nome: cliente.nome,
            documento: cliente.documento,
            telefone: cliente.telefone,
            email: cliente.email,
            endereco: cliente.endereco,
            ativo: cliente.ativo,
        }

        if (cliente.id_cliente) {
            const updatedClient = await this.prisma.cliente.update({
                where: { id_cliente: cliente.id_cliente },
                data: datas,
            })

            return this.mapToClientDomain(updatedClient)
        }

        const createdClient = await this.prisma.cliente.create({
            data: datas,
        })

        return this.mapToClientDomain(createdClient)
    }

    async findClientByDocument(
        documento: string,
    ): Promise<Cliente | null> {
        const prismaClient = await this.prisma.cliente.findUnique({
            where: { documento },
        })

        if (!prismaClient) {
            return null
        }

        return this.mapToClientDomain(prismaClient)
    }

    async findClientById(id: number): Promise<Cliente | null> {
        const prismaClient = await this.prisma.cliente.findUnique({
            where: { id_cliente: id },
        })

        if (!prismaClient) {
            return null
        }

        return this.mapToClientDomain(prismaClient)
    }

    private mapToClientDomain(data: any): Cliente {
        return Cliente.recover(
            data.id_cliente,
            data.nome,
            data.documento,
            data.ativo,
            data.telefone,
            data.email,
            data.endereco,
        )
    }
}