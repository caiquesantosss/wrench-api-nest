import { z } from 'zod'

export const addItemOsSchema = z.object({
    id_catalogo_item: z.number().int().positive(),
    quantidade: z.number().positive(),
})

export type AddItemOsDTO = z.infer<typeof addItemOsSchema>

export const addItemsOsSchema = z
    .array(addItemOsSchema)
    .min(1, 'É necessário informar pelo menos um item.')

export type AddItemsOsDTO = z.infer<typeof addItemsOsSchema>