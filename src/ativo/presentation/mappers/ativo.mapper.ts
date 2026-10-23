import { Ativo } from '../../domain/entities/ativo'

export class AtivoMapper {
  static toHttp(ativo: Ativo) {
    return {
      id_ativo: ativo.id_ativo,
      id_cliente: ativo.id_cliente,
      descricao: ativo.descricao,
      tipo: ativo.tipo,
      marca: ativo.marca ?? null,
      modelo: ativo.modelo ?? null,
      identificacao: ativo.identificacao ?? null, 
      observacoes: ativo.observacoes ?? null,
      ativo: ativo.ativo,
      data_cadastro: ativo.data_cadastro,
    };
  }
}