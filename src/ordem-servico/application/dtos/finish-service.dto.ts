import z from "zod"

export const finishServiceSchema = z.object({
    solucao_aplicada: z.string().min(10, 
        'Descreva detalhadamente a solução que foi feita.'
    )
})

export type FinishServiceDTO = z.infer<typeof finishServiceSchema>