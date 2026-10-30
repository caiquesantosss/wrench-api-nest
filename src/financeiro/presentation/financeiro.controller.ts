import {
    Controller,
    Post,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    UseGuards,
    Get,
    Body,
    Patch,
} from '@nestjs/common'
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiUnauthorizedResponse,
    ApiOkResponse,
    ApiBody,
} from '@nestjs/swagger'
import { PaymentRegisterDTO, PaymentRegisterSchema } from '../application/dtos/payment-register.dto'
import { ZodValidationPipe } from '../../shared/pipes/zod-validation-pipe'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth-guard'

import { ListPendingOsChargeUseCase } from '../application/use-cases/list-all-os-charge-use-case'
import { GenerateOSChargeUseCase } from '../application/use-cases/generate-os-charge-use-case'
import { RegisterPaymentUseCase } from '../application/use-cases/register-payment-use-case'

@ApiTags('Financeiro')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('financeiro')
export class FinanceiroController {
    constructor(
        private readonly generateOSChargeUseCase: GenerateOSChargeUseCase,
        private readonly listPendingOsChargeUseCase: ListPendingOsChargeUseCase,
        private readonly registerPaymentUseCase: RegisterPaymentUseCase
    ) { }

    @Post('ordem-servico/:id/faturar')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Gerar cobrança de uma ordem de serviço',
        description:
            'Gera um lançamento financeiro do tipo RECEITA, vinculado à ordem de serviço informada. ' +
            'O lançamento é criado com status PENDENTE e utiliza o valor total da ordem de serviço.',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Identificador da ordem de serviço que será faturada.',
        example: 1,
    })
    @ApiCreatedResponse({
        description: 'Cobrança gerada com sucesso.',
        schema: {
            example: {
                id_financeiro: 1,
                id_ordem_servico: 1,
                descricao: 'Cobrança referente à OS #1',
                tipo_lancamento: 'RECEITA',
                status_pagamento: 'PENDENTE',
                valor: 1500.0,
                forma_pagamento: null,
                referencia_externa: null,
                data_vencimento: '2026-11-10T00:00:00.000Z',
                data_pagamento: null,
                data_cadastro: '2026-10-27T18:00:00.000Z',
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            'Identificador inválido ou impossibilidade de gerar a cobrança devido a uma regra de negócio.',
    })
    @ApiNotFoundResponse({
        description: 'Ordem de serviço não encontrada.',
    })
    @ApiConflictResponse({
        description:
            'Já existe um lançamento financeiro para a ordem de serviço informada.',
    })
    @ApiUnauthorizedResponse({
        description: 'Token de autenticação ausente ou inválido.',
    })
    async faturarOS(
        @Param('id', ParseIntPipe) idOrdemServico: number,
    ) {
        return this.generateOSChargeUseCase.execute(idOrdemServico)
    }

    @Get('cobrancas/pendentes')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Listar cobranças',
        description:
            'Retorna os lançamentos financeiros, ordenados pela data de cadastro.',
    })
    @ApiOkResponse({
        description: 'Cobranças listadas com sucesso.',
        schema: {
            example: [
                {
                    id_financeiro: 1,
                    id_ordem_servico: 10,
                    descricao: 'Faturamento referente à ordem de serviço #10',
                    tipo_lancamento: 'RECEITA',
                    status_pagamento: 'PENDENTE',
                    valor: 1500,
                    forma_pagamento: null,
                    referencia_externa: 'OS-10',
                    data_vencimento: '2026-11-01T00:00:00.000Z',
                    data_pagamento: null,
                    data_cadastro: '2026-10-27T12:00:00.000Z',
                },
            ],
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Token de autenticação ausente ou inválido.',
    })
    async listAll() {
        return this.listPendingOsChargeUseCase.execute()
    }

    @Patch(':id/pagar')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Registrar pagamento de lançamento financeiro',
        description:
            'Registra o pagamento de um lançamento financeiro, informando a forma de pagamento e atualizando seu status para PAGO.',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Identificador único do lançamento financeiro.',
        example: 1,
    })
    @ApiBody({
        description: 'Dados necessários para registrar o pagamento.',
        schema: {
            type: 'object',
            required: ['forma_pagamento'],
            properties: {
                forma_pagamento: {
                    type: 'string',
                    enum: [
                        'PIX',
                        'CARTAO_CREDITO',
                        'CARTAO_DEBITO',
                        'DINHEIRO',
                        'BOLETO',
                        'TRANSFERENCIA',
                    ],
                    example: 'PIX',
                    description: 'Forma de pagamento utilizada.',
                },
            },
        },
        examples: {
            pix: {
                summary: 'Pagamento via PIX',
                value: {
                    forma_pagamento: 'PIX',
                },
            },
            cartao: {
                summary: 'Pagamento via cartão de crédito',
                value: {
                    forma_pagamento: 'CARTAO_CREDITO',
                },
            },
        },
    })
    @ApiOkResponse({
        description: 'Pagamento registrado com sucesso.',
        schema: {
            example: {
                id_financeiro: 1,
                id_ordem_servico: 10,
                descricao: 'Faturamento referente à ordem de serviço #10',
                tipo_lancamento: 'RECEITA',
                status_pagamento: 'PAGO',
                valor: '350.00',
                forma_pagamento: 'PIX',
                referencia_externa: null,
                data_vencimento: '2026-10-30T00:00:00.000Z',
                data_pagamento: '2026-10-27T20:00:00.000Z',
                data_cadastro: '2026-10-27T18:00:00.000Z',
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            'Dados inválidos ou lançamento que não pode ser pago, como um lançamento já pago ou cancelado.',
    })
    @ApiNotFoundResponse({
        description: 'Lançamento financeiro não encontrado.',
    })
    async registrarPagamento(
        @Param('id', ParseIntPipe) idFinanceiro: number,
        @Body(new ZodValidationPipe(PaymentRegisterSchema))
        body: PaymentRegisterDTO,
    ) {
        return this.registerPaymentUseCase.execute(idFinanceiro, body)
    }
}