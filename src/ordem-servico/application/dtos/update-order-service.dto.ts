import { z } from 'zod'

export const updateOrderServicoSchema = z.object({
    id_cliente: z
        .number()
        .int('O ID do cliente deve ser um número inteiro.')
        .positive('O ID do cliente deve ser maior que zero.'),

    id_ativo: z
        .number()
        .int('O ID do ativo deve ser um número inteiro.')
        .positive('O ID do ativo deve ser maior que zero.'),

    descricao_problema: z
        .string()
        .trim()
        .min(5, 'A descrição deve possuir pelo menos 5 caracteres.'),

    data_previsao: z
        .string()
        .datetime({
            message: 'Informe uma data de previsão válida.',
        })
        .nullable(),
})

export type UpdateOrderServicoDTO = z.infer<
    typeof updateOrderServicoSchema
>
