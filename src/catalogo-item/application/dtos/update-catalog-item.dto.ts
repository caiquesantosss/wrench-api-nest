import z from "zod";

export const updateCatalogItemSchema = z.object({
    descricao: z.string().min(3).optional(),
    unidade: z.string().min(1).optional(),
    valor_unitario: z.number().nonnegative('O valor unitário não pode ser negativo.')
        .optional()
})

export type UpdateCatalogItemDTO = z.infer<typeof updateCatalogItemSchema>