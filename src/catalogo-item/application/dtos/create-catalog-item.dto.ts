import { z } from 'zod'

export const createCatalogItemSchema = z.object({
    descricao: z.string()
        .min(3, 'A descrição deve ter pelo menos 3 caracteres.'),

    tipo_item: z.enum(['PRODUTO', 'SERVICO'], {
        error: "O tipo deve ser 'PRODUTO' ou 'SERVICO'"
    }),

    unidade: z.string()
        .min(1, 'A unidade de medida é obrigatória (ex: UN, LT, HR).'),

    valor_unitario: z.number()
        .nonnegative('O valor unitário não pode ser negativo.'),

    estoque_atual: z.number()
        .nonnegative('O estoque não pode ser negativo.')
        .optional()
        .default(0),

    estoque_minimo: z.number()
        .nonnegative('O estoque mínimo não pode ser negativo.')
        .optional()
        .default(0)
})

export type CreateCatalogItemDTO = z.infer<typeof createCatalogItemSchema>