import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import { OrdemServico, StatusOS } from '../../domain/entities/OrdemServico'
import { ItemOS } from '../../domain/entities/ItemOS'
import { OrdemServicoRepository } from '../../domain/repositories/OrdemServicoRepository'
import { Prisma } from '../../../generated/prisma/client'
import { OrdemServicoDetailsDTO } from '../../application/dtos/order-service-details.dto'

@Injectable()
export class PrismaOrdemServicoRepository implements OrdemServicoRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: Prisma.TransactionClient
  ) { }

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

  async findDetailsById(
    id: number,
  ): Promise<OrdemServicoDetailsDTO | null> {
    const serviceOrderData = await this.prisma.ordemServico.findUnique({
      where: {
        id_ordem_servico: id,
      },

      relationLoadStrategy: 'join',

      select: {
        id_ordem_servico: true,
        id_cliente: true,
        id_ativo: true,
        id_usuario: true,
        status: true,
        descricao_problema: true,
        diagnostico: true,
        solucao_aplicada: true,
        valor_mao_obra: true,
        valor_pecas: true,
        valor_total: true,
        data_abertura: true,
        data_previsao: true,
        data_conclusao: true,
        data_atualizacao: true,

        cliente: {
          select: {
            id_cliente: true,
            nome: true,
            documento: true,
            telefone: true,
            email: true,
          },
        },

        ativo: {
          select: {
            id_ativo: true,
            descricao: true,
            tipo: true,
            marca: true,
            modelo: true,
            identificacao: true,
          },
        },

        usuario: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
            perfil: true,
          },
        },

        itens_os: {
          select: {
            id_item_os: true,
            id_catalogo_item: true,
            quantidade: true,
            valor_unitario: true,
            valor_total: true,
            status_aprovacao: true,
            baixa_estoque: true,
            data_cadastro: true,

            catalogo_item: {
              select: {
                id_catalogo_item: true,
                descricao: true,
                tipo_item: true,
                unidade: true,
                valor_unitario: true,
              },
            },
          },
        },
      },
    })

    if (!serviceOrderData) {
      return null
    }

    return {
      ...serviceOrderData,
      valor_mao_obra: Number(serviceOrderData.valor_mao_obra),
      valor_pecas: Number(serviceOrderData.valor_pecas),
      valor_total: Number(serviceOrderData.valor_total),

      itens_os: serviceOrderData.itens_os.map((item) => ({
        ...item,
        quantidade: Number(item.quantidade),
        valor_unitario: Number(item.valor_unitario),
        valor_total: Number(item.valor_total),
        catalogo_item: {
          ...item.catalogo_item,
          valor_unitario: Number(item.catalogo_item.valor_unitario),
        },
      })),
    }
  }

  async listAll() {
    const serviceOrdersData = await this.prisma.ordemServico.findMany({
      relationLoadStrategy: 'join',

      select: {
        id_ordem_servico: true,
        id_cliente: true,
        id_ativo: true,
        id_usuario: true,
        status: true,
        descricao_problema: true,
        diagnostico: true,
        solucao_aplicada: true,
        valor_mao_obra: true,
        valor_pecas: true,
        valor_total: true,
        data_abertura: true,
        data_previsao: true,
        data_conclusao: true,
        data_atualizacao: true,

        cliente: {
          select: {
            id_cliente: true,
            nome: true,
            documento: true,
            telefone: true,
            email: true,
          },
        },

        ativo: {
          select: {
            id_ativo: true,
            descricao: true,
            tipo: true,
            marca: true,
            modelo: true,
            identificacao: true,
          },
        },

        usuario: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
            perfil: true,
          },
        },

        itens_os: {
          select: {
            id_item_os: true,
            id_catalogo_item: true,
            quantidade: true,
            valor_unitario: true,
            valor_total: true,
            status_aprovacao: true,
            baixa_estoque: true,
            data_cadastro: true,

            catalogo_item: {
              select: {
                id_catalogo_item: true,
                descricao: true,
                tipo_item: true,
                unidade: true,
                valor_unitario: true,
              },
            },
          },
        },
      },

      orderBy: {
        data_abertura: 'desc',
      },
    })

    return serviceOrdersData
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