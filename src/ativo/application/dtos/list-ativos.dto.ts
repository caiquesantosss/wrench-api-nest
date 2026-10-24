import { z } from 'zod'

export const listAtivosSchema = z.object({
    id_cliente: z.coerce.number().int().positive().optional(),
})

export type ListAtivosDTO = z.infer<typeof listAtivosSchema>