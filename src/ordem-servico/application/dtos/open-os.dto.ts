import z from "zod"

export const openOsSchema = z.object({
    id_cliente: z.number().positive('O ID do cliente é obrigatório.'),
    id_ativo: z.number().positive('O ID do veículo/máquina é obrigatório.'),
    descricao_problema: z.string()
        .min(5, 'A descrição do problema deve ter no mínimo 5 caracteres.'),
})

export type OpenOsDTO = z.infer<typeof openOsSchema>