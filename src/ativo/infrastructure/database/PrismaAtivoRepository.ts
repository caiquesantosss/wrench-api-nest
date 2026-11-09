import { Inject, Injectable } from "@nestjs/common"
import { AtivoRepository } from "../../domain/repositories/AtivoRepository"
import { PrismaService } from "../../../prisma/prisma.service"
import { Ativo } from "../../domain/entities/ativo"
import { Prisma } from "../../../generated/prisma/client"
import { AtivoWithClientDTO } from "../../application/dtos/ativo-with-client.dto"

@Injectable()
export class PrismaAtivoRepository implements AtivoRepository {
    constructor(
        @Inject(PrismaService)
        private readonly prisma: Prisma.TransactionClient
    ) { }

    async save(ativo: Ativo): Promise<Ativo> {
        const data = {
            id_cliente: ativo.id_cliente,
            descricao: ativo.descricao,
            tipo: ativo.tipo,
            marca: ativo.marca ?? null,
            modelo: ativo.modelo ?? null,
            identificacao: ativo.identificacao ?? null,
            observacoes: ativo.observacoes ?? null,
            ativo: ativo.ativo,
            data_cadastro: ativo.data_cadastro
        }

        let savedAtivo

        if (ativo.id_ativo) {
            savedAtivo = await this.prisma.ativo.update({
                where: { id_ativo: ativo.id_ativo },
                data,
            })
        } else {
            savedAtivo = await this.prisma.ativo.create({
                data
            })
        }

        return this.mapToDomain(savedAtivo)
    }

    async findById(id: number): Promise<Ativo | null> {
        const ativoDB = await this.prisma.ativo.findUnique({
            where: { id_ativo: id }
        })

        if (!ativoDB) return null
        return this.mapToDomain(ativoDB)
    }

    async listByClient(id_client: number): Promise<Ativo[]> {
        const ativoDB = await this.prisma.ativo.findMany({
            where: { id_cliente: id_client },
            orderBy: { data_cadastro: 'desc' }
        })

        return ativoDB.map(ativoDB => this.mapToDomain(ativoDB))
    }

    async listAll(): Promise<Ativo[]> {
        const ativosDB = await this.prisma.ativo.findMany({
            orderBy: {
                data_cadastro: 'desc'
            }
        })

        return ativosDB.map(ativoDB => this.mapToDomain(ativoDB))
    }

    async listAllWithClient(): Promise<AtivoWithClientDTO[]> {
        const ativosDB = await this.prisma.ativo.findMany({
            include: {
                cliente: {
                    select: {
                        id_cliente: true,
                        nome: true,
                        documento: true
                    }
                }
            },
            orderBy: {
                data_cadastro: 'desc'
            }
        })

        return ativosDB
    }
    
    async findByIdentification(identificacao: string): Promise<Ativo | null> {
        const ativoDb = await this.prisma.ativo.findFirst({
            where: { identificacao }
        })

        if (!ativoDb) return null
        return this.mapToDomain(ativoDb)
    }

    private mapToDomain(raw: any): Ativo {
        return Ativo.recover(
            raw.id_ativo,
            raw.id_cliente,
            raw.descricao,
            raw.tipo,
            raw.ativo,
            raw.data_cadastro,
            raw.marca,
            raw.modelo,
            raw.identificacao,
            raw.observacoes
        )
    }
}