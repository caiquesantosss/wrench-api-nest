import z from "zod";

export const updateEstimateCompletionDateSchema = z.object({
    data_previsao: z.iso.datetime({
        message: 'A data prevista deve estar no formato ISO 8601.'
    })
})

export type UpdateEstimateCompletionDateDTO = z.infer<
    typeof updateEstimateCompletionDateSchema
>