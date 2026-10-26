import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { Cliente } from "../../domain/entities/Cliente"
import { ClientRepository } from "../../domain/repositories/ClientRepository"

@Injectable()
export class PrismaClientRepository implements ClientRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async save(cliente: Cliente): Promise<Cliente> {
        const data = {
            nome: cliente.nome,
            documento: cliente.documento,
            telefone: cliente.telefone ?? null,
            email: cliente.email ?? null,
            endereco: cliente.endereco ?? null,
            ativo: cliente.ativo,
            data_cadastro: cliente.data_cadastro
        }

        if (cliente.id_cliente) {
            const updatedClient = await this.prisma.cliente.update({
                where: {
                    id_cliente: cliente.id_cliente,
                },
                data,
            })

            return this.mapToClientDomain(updatedClient)
        }

        const createdClient = await this.prisma.cliente.create({
            data,
        })

        return this.mapToClientDomain(createdClient)
    }

    async findClientByDocument(
        documento: string,
    ): Promise<Cliente | null> {
        const clientData = await this.prisma.cliente.findUnique({
            where: {
                documento,
            },
        })

        if (!clientData) {
            return null
        }

        return this.mapToClientDomain(clientData)
    }

    async findClientById(
        id: number,
    ): Promise<Cliente | null> {
        const clientData = await this.prisma.cliente.findUnique({
            where: {
                id_cliente: id,
            },
        })

        if (!clientData) {
            return null
        }

        return this.mapToClientDomain(clientData)
    }

    async listAll(): Promise<Cliente[]> {
        const clientsData = await this.prisma.cliente.findMany({
            orderBy: {
                nome: "asc",
            },
        })

        return clientsData.map((client) =>
            this.mapToClientDomain(client)
        )
    }


    private mapToClientDomain(data: {
        id_cliente: number
        nome: string
        documento: string
        telefone: string | null
        email: string | null
        endereco: string | null
        ativo: boolean
        data_cadastro: Date
    }): Cliente {
        return Cliente.recover(
            data.id_cliente,
            data.nome,
            data.documento,
            data.ativo,
            data.data_cadastro,
            data.telefone ?? undefined,
            data.email,
            data.endereco,
        )
    }
}