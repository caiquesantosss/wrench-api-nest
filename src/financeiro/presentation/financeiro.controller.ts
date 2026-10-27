import {
    Controller,
    Post,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    UseGuards,
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
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../shared/guards/jwt-auth-guard'
import { GenerateOSChargeUseCase } from '../application/use-cases/generate-os-charge-use-case'

@ApiTags('Financeiro')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('financeiro')
export class FinanceiroController {
    constructor(
        private readonly generateOSChargeUseCase: GenerateOSChargeUseCase,
    ) {}

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
}