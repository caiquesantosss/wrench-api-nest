import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { OrdemServico } from '../../domain/entities/OrdemServico'
import { OrdemServicoRepository } from '../../domain/repositories/OrdemServicoRepository';

@Injectable()
export class PrismaOrdemServicoRepository implements OrdemServicoRepository {
  constructor(private prisma: PrismaService) {}

  async save(os: OrdemServico): Promise<OrdemServico> {
    const dados = {
      id_cliente: os.id_cliente,
      id_ativo: os.id_ativo,
      id_usuario: os.id_usuario,
      status: os.status,
      descricao_problema: os.descricao_problema,
      diagnostico: os.diagnostico,
      solucao_aplicada: os.solucao_aplicada,
      valor_mao_obra: os.valor_mao_obra,
      valor_pecas: os.valor_pecas,
      valor_total: os.valor_total,
      data_abertura: os.data_abertura,
      data_previsao: os.data_previsao,
      data_conclusao: os.data_conclusao,
      data_atualizacao: os.data_atualizacao,
    };

    if (os.id_ordem_servico) {
      const osAtualizada = await this.prisma.ordemServico.update({
        where: { id_ordem_servico: os.id_ordem_servico },
        data: dados,
      });
      return this.mapToDomain(osAtualizada);
    }

    const osCriada = await this.prisma.ordemServico.create({ data: dados });
    return this.mapToDomain(osCriada);
  }

  async findById(id: number): Promise<OrdemServico | null> {
    const osPrisma = await this.prisma.ordemServico.findUnique({
      where: { id_ordem_servico: id },
    });

    if (!osPrisma) return null;
    return this.mapToDomain(osPrisma);
  }

  private mapToDomain(dado: any): OrdemServico {
    return OrdemServico.recover(
      dado.id_ordem_servico,
      dado.id_cliente,
      dado.id_ativo,
      dado.id_usuario,
      dado.status,
      dado.descricao_problema,
      dado.data_abertura,
      dado.data_atualizacao,
      Number(dado.valor_mao_obra), 
      Number(dado.valor_pecas),
      Number(dado.valor_total),
      dado.diagnostico,
      dado.solucao_aplicada,
      dado.data_previsao,
      dado.data_conclusao
    );
  }
}