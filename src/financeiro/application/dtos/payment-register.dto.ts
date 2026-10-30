import z from 'zod'

export const PaymentRegisterSchema = z.object({
    forma_pagamento: z.enum(
        [
            'PIX',
            'CARTAO_CREDITO',
            'CARTAO_DEBITO',
            'DINHEIRO',
            'BOLETO',
            'TRANSFERENCIA',
        ],
        {
            message: 'A forma de pagamento é obrigatória.',
        },
    ),
})

export type PaymentRegisterDTO = z.infer<typeof PaymentRegisterSchema>