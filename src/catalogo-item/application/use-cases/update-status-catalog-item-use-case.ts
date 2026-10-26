import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { CatalogItemRepository } from "../../domain/repositories/CatalogItemRepository"
import { CatalogItem } from "../../domain/entities/CatalogItem"

@Injectable()
export class UpdateStatusCatalogItem {
    constructor(
        @Inject('CatalogItemRepository')
        private readonly catalogItemRepository: CatalogItemRepository
    ) {}

    // Soft Delete
    async execute(id_item: number, newStatus: boolean): Promise<CatalogItem> {
        const item = await this.catalogItemRepository.findById(id_item)

        if (!item) {
            throw new NotFoundException('O item não pode ser encontrado')
        }

        if (newStatus) {
            item.active()
        } else {
            item.desactive()
        }

        return await this.catalogItemRepository.save(item)
    }

}