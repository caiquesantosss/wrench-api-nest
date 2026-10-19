import z from "zod";

export const updateStatusCatalogItemSchema = z.object({
    ativo: z.boolean('O campo ativo é obrigatório.')
})

export type UpdateStatusCatalogDTO = z.infer<
    typeof updateStatusCatalogItemSchema
>