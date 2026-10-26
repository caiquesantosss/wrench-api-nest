import { z } from 'zod'

export const updateAtivoSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres.'),
  tipo: z.string().min(2, 'O tipo do ativo é obrigatório.'),
  
  marca: z.string().nullable().optional(),
  modelo: z.string().nullable().optional(),
  identificacao: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
})

export type UpdateAtivoDTO = z.infer<typeof updateAtivoSchema>