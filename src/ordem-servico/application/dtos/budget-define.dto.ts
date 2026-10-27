import z from 'zod'

export const budgetDefineSchema = z.object({

    valor_mao_obra: z.number().nonnegative(
        'O valor da mão de obra não pode ser negativo.'
    ),
})

export type BudgetDefineDTO = z.infer<typeof budgetDefineSchema>