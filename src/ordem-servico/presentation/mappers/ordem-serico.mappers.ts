import { OrdemServico } from '../../domain/entities/OrdemServico'

export class OrdemServicoMapper {
  static toHttp(os: OrdemServico) {
    return {
      id_ordem_servico: os.id_ordem_servico,
      id_cliente: os.id_cliente,
      id_ativo: os.id_ativo,
      id_usuario: os.id_usuario,
      status: os.status,
      descricao_problema: os.descricao_problema,
      diagnostico: os.diagnostico ?? null,
      solucao_aplicada: os.solucao_aplicada ?? null,
      valor_mao_obra: os.valor_mao_obra,
      valor_pecas: os.valor_pecas,
      valor_total: os.valor_total,
      data_abertura: os.data_abertura,
      data_previsao: os.data_previsao ?? null,
      data_conclusao: os.data_conclusao ?? null,
      data_atualizacao: os.data_atualizacao,
    };
  }
}