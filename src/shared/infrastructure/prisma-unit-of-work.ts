import { Injectable } from "@nestjs/common"
import { UnitOfWork } from "../application/interfaces/unit-of-work.interface"
import { PrismaService } from "../../prisma/prisma.service"
import { CatalogItemRepository } from "../../catalogo-item/domain/repositories/CatalogItemRepository"
import { OrdemServicoRepository } from "../../ordem-servico/domain/repositories/OrdemServicoRepository"
import { PrismaCatalogItemRepository } from "../../catalogo-item/infrastructure/database/PrismaCatalogItemRepository"
import { PrismaOrdemServicoRepository } from "../../ordem-servico/infrastructure/database/PrismaOrdemServicoRepository"

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
    constructor(private readonly prisma: PrismaService) { }

    async runInTransaction<T>(
        work: (
            osRepo: OrdemServicoRepository,
            catalogRepo: CatalogItemRepository
        ) => Promise<T>): Promise<T> {
        return await this.prisma.$transaction(async (tx) => {
            const osRepoTx = new PrismaOrdemServicoRepository(tx)
            const osCatalogTx = new PrismaCatalogItemRepository(tx)

            return await work(osRepoTx, osCatalogTx)
        })
    }


}