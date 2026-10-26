import z from "zod"

export const addDiagnosticSchema = z.object({
    diagnostico: z.string().min(10, 'O diagnóstico deve ser detalhado')
}) 

export type AddDiagnosticDTO = z.infer<typeof addDiagnosticSchema>