import z from "zod";

export const addItemOsSchema = z.object({
    id_catalogo_item: z.number().int().positive('O ID do item do catálogo é obrigatório.'),
    quantidade: z.number().positive('A quantidade deve ser maior que zero.'),
})

export type AddItemOsDTO = z.infer<typeof addItemOsSchema>