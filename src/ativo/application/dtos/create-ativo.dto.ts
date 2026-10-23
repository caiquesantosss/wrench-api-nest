import { z } from 'zod'

export const createAtivoSchema = z.object({
    id_cliente: z.number().int().positive('O ID do cliente deve ser válido.'),
    descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres.'),
    tipo: z.string().min(2, 'O tipo do ativo é obrigatório.'),

    marca: z.string().nullable().optional(),
    modelo: z.string().nullable().optional(),
    identificacao: z.string().nullable().optional(),
    observacoes: z.string().nullable().optional(),
});

export type CreateAtivoDTO = z.infer<typeof createAtivoSchema>