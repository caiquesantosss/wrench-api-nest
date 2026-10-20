import z from "zod";

export const stockMovementSchema = z.object({
    quantidade: z.number()
        .int('A quantidade deve ser um número inteiro.')
        .positive('A quantidade deve ser maior que zero.'),
})

export type StockMovementDTO = z.infer<typeof stockMovementSchema>