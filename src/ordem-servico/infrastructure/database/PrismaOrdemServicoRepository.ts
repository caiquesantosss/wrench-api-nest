import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import { OrdemServico, StatusOS } from '../../domain/entities/OrdemServico'
import { ItemOS } from '../../domain/entities/ItemOS'
import { OrdemServicoRepository } from '../../domain/repositories/OrdemServicoRepository'

@Injectable()
export class PrismaOrdemServicoRepository implements OrdemServicoRepository {
  constructor(private prisma: PrismaService) { }

  async save(os: OrdemServico): Promise<OrdemServico> {
    const serviceOrderData = {
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
    }

    const itemsToCreate = os.items
      .filter(item => !item.id_item_os)
      .map(item => ({
        id_catalogo_item: item.id_catalogo_item,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        valor_total: item.valor_total,
        status_aprovacao: item.status_aprovacao,
        baixa_estoque: item.baixa_estoque,
        data_cadastro: item.data_cadastro,
      }))

    const itemsToUpdate = os.items
      .filter(item => item.id_item_os !== undefined)
      .map(item => ({
        where: { id_item_os: item.id_item_os! },
        data: {
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
          status_aprovacao: item.status_aprovacao,
          baixa_estoque: item.baixa_estoque,
        },
      }))

    const currentItemIds = os.items
      .map(item => item.id_item_os)
      .filter((id): id is number => id !== undefined)

    const includeItems = {
      itens_os: {
        include: {
          catalogo_item: {
            select: { tipo_item: true },
          },
        },
      },
    }

    if (os.id_ordem_servico) {
      const updatedServiceOrder = await this.prisma.ordemServico.update({
        where: { id_ordem_servico: os.id_ordem_servico },
        data: {
          ...serviceOrderData,
          itens_os: {
            deleteMany: {
              id_item_os: { notIn: currentItemIds },
            },
            create: itemsToCreate,
            update: itemsToUpdate,
          },
        },
        include: includeItems,
      })

      return this.mapToDomain(updatedServiceOrder)
    }

    const createdServiceOrder = await this.prisma.ordemServico.create({
      data: {
        ...serviceOrderData,
        itens_os: {
          create: itemsToCreate,
        },
      },
      include: includeItems,
    })

    return this.mapToDomain(createdServiceOrder)
  }

  async findById(id: number): Promise<OrdemServico | null> {
    const serviceOrderData = await this.prisma.ordemServico.findUnique({
      where: { id_ordem_servico: id },
      include: {
        itens_os: {
          include: {
            catalogo_item: {
              select: { tipo_item: true },
            },
          },
        },
      },
    })

    if (!serviceOrderData) {
      return null
    }

    return this.mapToDomain(serviceOrderData)
  }


  private mapToDomain(data: any): OrdemServico {
    const serviceOrder = OrdemServico.recover(
      data.id_ordem_servico,
      data.id_cliente,
      data.id_ativo,
      data.id_usuario,
      data.status as StatusOS,
      data.descricao_problema,
      data.data_abertura,
      data.data_atualizacao,
      Number(data.valor_mao_obra),
      Number(data.valor_pecas),
      Number(data.valor_total),
      data.diagnostico,
      data.solucao_aplicada,
      data.data_previsao,
      data.data_conclusao
    )

    if (data.itens_os?.length) {
      const restoredItems = data.itens_os.map((itemData: any) =>
        ItemOS.recover(
          itemData.id_item_os,
          itemData.id_catalogo_item,
          itemData.catalogo_item.tipo_item,
          Number(itemData.quantidade),
          Number(itemData.valor_unitario),
          itemData.status_aprovacao,
          itemData.baixa_estoque,
          itemData.data_cadastro
        )
      )

      serviceOrder.loadItemsFromDatabase(restoredItems)
    }

    return serviceOrder
  }
}