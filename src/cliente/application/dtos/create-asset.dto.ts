import { z } from 'zod'

export const createAssetSchema = z.object({
  id_cliente: z.number().positive('Client ID is required.'), 
  descricao: z.string().min(3, 'Description is required.'),
  tipo: z.enum(
    ['VEICULO', 'MAQUINA_PNEUMATICA', 'EQUIPAMENTO_INDUSTRIAL'],
    { error: 'Invalid asset type' }
  ),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  identificacao: z.string().optional(),
  observacoes: z.string().optional(),
})

export type CreateAssetDto = z.infer<typeof createAssetSchema>