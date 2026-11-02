import z from "zod"

export const ordemServicoListagemSchema = z.object({
    id_ordem_servico: z.number(),
    id_cliente: z.number(),
    id_ativo: z.number(),
    id_usuario: z.number(),

    status: z.string(),
    descricao_problema: z.string(),
    diagnostico: z.string().nullable(),
    solucao_aplicada: z.string().nullable(),

    valor_mao_obra: z.unknown(),
    valor_pecas: z.unknown(),
    valor_total: z.unknown(),

    data_abertura: z.date(),
    data_previsao: z.date().nullable(),
    data_conclusao: z.date().nullable(),
    data_atualizacao: z.date(),

    cliente: z.object({
        id_cliente: z.number(),
        nome: z.string(),
        documento: z.string(),
        telefone: z.string().nullable(),
        email: z.string().nullable(),
    }),

    ativo: z.object({
        id_ativo: z.number(),
        descricao: z.string(),
        tipo: z.string(),
        marca: z.string().nullable(),
        modelo: z.string().nullable(),
        identificacao: z.string().nullable(),
    }),

    usuario: z.object({
        id_usuario: z.number(),
        nome: z.string(),
        email: z.string(),
        perfil: z.string(),
    }),

    itens_os: z.array(
        z.object({
            id_item_os: z.number(),
            id_catalogo_item: z.number(),
            quantidade: z.unknown(),
            valor_unitario: z.unknown(),
            valor_total: z.unknown(),
            status_aprovacao: z.string().nullable(),
            baixa_estoque: z.boolean(),
            data_cadastro: z.date(),

            catalogo_item: z.object({
                id_catalogo_item: z.number(),
                descricao: z.string(),
                tipo_item: z.string(),
                unidade: z.string().nullable(),
                valor_unitario: z.unknown(),
            }),
        })
    ),
})

export type OrdemServicoListagemDTO = z.infer<typeof ordemServicoListagemSchema>