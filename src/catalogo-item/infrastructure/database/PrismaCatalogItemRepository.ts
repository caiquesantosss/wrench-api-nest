import { Injectable } from "@nestjs/common"
import { CatalogItemRepository } from "../../domain/repositories/CatalogItemRepository"
import { CatalogItem } from "../../domain/entities/CatalogItem"
import { PrismaService } from "../../../prisma/prisma.service"
import { Prisma } from "../../../generated/prisma/client"

@Injectable()
export class PrismaCatalogItemRepository implements CatalogItemRepository {
    constructor(
        private readonly prisma: PrismaService | Prisma.TransactionClient
    ) { }

    async save(item: CatalogItem): Promise<CatalogItem> {
        const data = {
            descricao: item.descricao,
            tipo_item: item.tipo_item,
            unidade: item.unidade,
            valor_unitario: item.valor_unitario,
            estoque_atual: item.estoque_atual,
            estoque_minimo: item.estoque_minimo,
            ativo: item.ativo,
            data_cadastro: item.data_cadastro
        }

        if (item.id_catalogo_item) {
            const updatedItem = await this.prisma.catalogoItem.update({
                where: { id_catalogo_item: item.id_catalogo_item },
                data
            })

            return this.mapToDomain(updatedItem)
        }

        const createdItem = await this.prisma.catalogoItem.create({
            data
        })

        return this.mapToDomain(createdItem)
    }


    async findById(id: number): Promise<CatalogItem | null> {
        const prismaItem = await this.prisma.catalogoItem.findUnique({
            where: { id_catalogo_item: id }
        })

        if (!prismaItem) return null

        return this.mapToDomain(prismaItem)
    }

    async listActives(): Promise<CatalogItem[]> {
        const prismaItems = await this.prisma.catalogoItem.findMany({
            where: { ativo: true }
        })

        return prismaItems.map((item: any) => this.mapToDomain(item))
    }


    private mapToDomain(data: any): CatalogItem {
        return CatalogItem.recover(
            data.id_catalogo_item,
            data.descricao,
            data.tipo_item,
            data.unidade,
            Number(data.valor_unitario),
            Number(data.estoque_atual),
            Number(data.estoque_minimo),
            data.ativo,
            data.data_cadastro
        );
    }
}
