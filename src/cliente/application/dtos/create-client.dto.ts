import { z } from 'zod';
import { isValidCNPJ, isValidCPF } from '../../utils/document-validator';

export const createClientSchema = z.object({
    nome: z.string().min(3, 'O nome dever ter no minímo 3 caracteres'),
    documento: z.string().transform(doc => doc.replace(/[^\d]+/g, ''))
        .refine((doc) => {
            if (doc.length === 11) return isValidCPF(doc)
            if (doc.length === 14) return isValidCNPJ(doc)
            return false
        }, {
            message: 'Verificar digito, CPF ou CPNJ no formato errado.'
        }),

    telefone: z.string().optional(),
    email: z.email('Formato do e-mail inválido!').optional(),
    endereco: z.string().optional(),
});

export type CreateClientDto = z.infer<typeof createClientSchema>