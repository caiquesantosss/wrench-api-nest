import { CatalogItem } from "../../domain/entities/CatalogItem"

export class CatalogItemMapper {
  static toHttp(item: CatalogItem) {
    return {
      id_catalogo_item: item.id_catalogo_item,
      descricao: item.descricao,
      tipo_item: item.tipo_item,
      unidade: item.unidade,
      valor_unitario: item.valor_unitario,
      estoque_atual: item.estoque_atual,
      estoque_minimo: item.estoque_minimo,
      ativo: item.ativo,
      data_cadastro: item.data_cadastro,
    }
  }
}