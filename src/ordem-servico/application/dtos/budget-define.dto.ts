import z from "zod";

export const budgetDefineSchema = z.object({
    valor_pecas: z.number().nonnegative(
        'O valor das peças não pode ser negativo.'
    ),
    valor_mao_obra: z.number().nonnegative(
        'O valor da mão de obra não pode ser negativo'
    ), 
    data_previsao: z.string().datetime().optional()
})

export type BudgetDefineDTO = z.infer<typeof budgetDefineSchema>