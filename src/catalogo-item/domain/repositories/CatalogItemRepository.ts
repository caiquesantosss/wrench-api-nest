import { CatalogItem } from '../entities/CatalogItem'

export interface CatalogItemRepository {
    save(item: CatalogItem): Promise<CatalogItem>
    findById(id: number): Promise<CatalogItem | null>
    listActives(): Promise<CatalogItem[]>
}