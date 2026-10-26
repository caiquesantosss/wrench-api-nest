import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { CatalogItemRepository } from "../../domain/repositories/CatalogItemRepository"
import { UpdateCatalogItemDTO } from "../dtos/update-catalog-item.dto"
import { CatalogItem } from "../../domain/entities/CatalogItem"

@Injectable()
export class UpdateCatalogItemUseCase {
    constructor(
        @Inject('CatalogItemRepository')
        private readonly catalogItemRepository: CatalogItemRepository
    ) {}

    async execute(id_item: number, data: UpdateCatalogItemDTO): Promise<CatalogItem> {
        const item = await this.catalogItemRepository.findById(id_item)

        if (!item) {
            throw new NotFoundException('O item não pode ser encontrado!')
        }

        if (data.descricao || data.unidade) {
            const newDescricao = data.descricao ?? item.descricao 
            const newUnidade = data.unidade ?? item.unidade

            item.updateBasicDatas(newDescricao, newUnidade)
        }

        if (data.valor_unitario !== undefined) {
            item.updatePrice(data.valor_unitario)
        }

        return await this.catalogItemRepository.save(item)
    }
}