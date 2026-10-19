import { Inject, Injectable } from "@nestjs/common";
import { CatalogItemRepository } from "../../domain/repositories/CatalogItemRepository";
import { CatalogItem } from "../../domain/entities/CatalogItem";

@Injectable()
export class ListCatalogItemUseCase {

    constructor(
        @Inject('CatalogItemRepository')
        private readonly catalogItemRepository: CatalogItemRepository
    ) {}

    async execute(): Promise<CatalogItem[]> {
        return await this.catalogItemRepository.listActives()
    }
}