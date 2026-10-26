import { Inject, Injectable } from "@nestjs/common"
import { CatalogItemRepository } from "../../domain/repositories/CatalogItemRepository"
import { CreateCatalogItemDTO } from "../dtos/create-catalog-item.dto"
import { CatalogItem } from "../../domain/entities/CatalogItem"

@Injectable()
export class CreateCatalogItemUseCase {
    
    constructor(
        @Inject("CatalogItemRepository")
        private readonly catalogItemRepository: CatalogItemRepository
    ) {}

    async execute(data: CreateCatalogItemDTO): Promise<CatalogItem> {
        const newItem = CatalogItem.create(
            data.descricao, 
            data.tipo_item, 
            data.unidade,
            data.valor_unitario, 
            data.estoque_atual, 
            data.estoque_minimo
        )

        return await this.catalogItemRepository.save(newItem)
    }
}