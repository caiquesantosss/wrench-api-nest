import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { CatalogItemRepository } from "../../domain/repositories/CatalogItemRepository"
import { CatalogItem } from "../../domain/entities/CatalogItem"

@Injectable()
export class RemoveStockUseCase {
    constructor(
        @Inject('CatalogItemRepository')
        private readonly catalogItemRepository: CatalogItemRepository
    ) {}

    async execute(id_item: number, quantity: number): Promise<CatalogItem> {
        const item = await this.catalogItemRepository.findById(id_item)

        if (!item) {
            throw new NotFoundException('O item não pode ser encontrado!')
        }

        item.removeStock(quantity)

        return await this.catalogItemRepository.save(item)
    }
}