import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { Ativo } from "../../domain/entities/Ativo"
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

    async saveAtivo(ativo: Ativo): Promise<Ativo> {
        const datas = {
            id_cliente: ativo.id_cliente,
            descricao: ativo.descricao,
            tipo: ativo.tipo,
            marca: ativo.marca,
            modelo: ativo.modelo,
            identificacao: ativo.identificacao,
            observacoes: ativo.observacoes,
            ativo: ativo.ativo,
        }

        if (ativo.id_ativo) {
            const updatedAtivo = await this.prisma.ativo.update({
                where: { id_ativo: ativo.id_ativo },
                data: datas,
            })

            return this.mapToAtivoDomain(updatedAtivo)
        }

        const createdAtivo = await this.prisma.ativo.create({
            data: datas,
        })

        return this.mapToAtivoDomain(createdAtivo)
    }

    async listCLientsAtivo(id_cliente: number): Promise<Ativo[]> {
        const ativos = await this.prisma.ativo.findMany({
            where: { id_cliente },
        })

        return ativos.map((ativo) => this.mapToAtivoDomain(ativo))
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

    private mapToAtivoDomain(data: any): Ativo {
        return Ativo.recover(
            data.id_ativo,
            data.id_cliente,
            data.descricao,
            data.tipo,
            data.ativo,
            data.marca,
            data.modelo,
            data.identificacao,
            data.observacoes,
        )
    }
}