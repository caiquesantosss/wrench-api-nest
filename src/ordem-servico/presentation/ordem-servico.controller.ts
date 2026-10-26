import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    Delete
} from '@nestjs/common'

import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiParam,
    ApiOkResponse,
    ApiResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../shared/guards/jwt-auth-guard'
import { LoggedUser } from '../../shared/decorators/logged-user-decorator'
import { ZodValidationPipe } from '../../shared/pipes/zod-validation-pipe'

import { OpenOsDTO, openOsSchema } from '../application/dtos/open-os.dto'
import { AddDiagnosticDTO, addDiagnosticSchema } from '../application/dtos/add-diagnostic.dto'
import { BudgetDefineDTO, budgetDefineSchema } from '../application/dtos/budget-define.dto'
import { FinishServiceDTO, finishServiceSchema } from '../application/dtos/finish-service.dto'
import { AddItemOsDTO, addItemOsSchema } from '../application/dtos/add-item-os.dto'
import { CompleteServiceOrderDto } from '../application/dtos/complete-service.dto'

import { OrdemServicoMapper } from './mappers/ordem-serico.mappers'

import { OpenServiceOrderUseCase } from '../application/use-cases/open-service-order-use-case'
import { AddDiagnosticUseCase } from '../application/use-cases/add-diagnostic-use-case'
import { BudgetDefineUseCase } from '../application/use-cases/budget-define-use-case'
import { StartExecutionUseCase } from '../application/use-cases/start-execution-use-case'
import { FinishServiceUseCase } from '../application/use-cases/finish-service-use-case'
import { AddItemOsUseCase } from '../application/use-cases/add-item-os-use-case'
import { RemoveItemOsUseCase } from '../application/use-cases/remove-item-os-use-case'
import { CancelItemOsUseCase } from '../application/use-cases/cancel-item-os-use-case'
import { CompleteServiceOrderUseCase } from '../application/use-cases/complete-service-order-use-case'

@ApiTags('Ordem de Serviço')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ordens-servico')
export class OrdemServicoController {
    constructor(
        private readonly openServiceOrderUseCase: OpenServiceOrderUseCase,
        private readonly addDiagnosticUseCase: AddDiagnosticUseCase,
        private readonly budgetDefineUseCase: BudgetDefineUseCase,
        private readonly startExecutionUseCase: StartExecutionUseCase,
        private readonly finishServiceUseCase: FinishServiceUseCase,
        private readonly addItemOsUseCase: AddItemOsUseCase,
        private readonly removeItemOsUseCase: RemoveItemOsUseCase,
        private readonly cancelItemOsUseCase: CancelItemOsUseCase, 
        private readonly completeServiceOrderUseCase: CompleteServiceOrderUseCase
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Abrir uma nova ordem de serviço',
        description: 'Cria uma ordem de serviço no estado inicial ABERTA, vinculada ao cliente, ao ativo e ao usuário autenticado.'
    })
    @ApiBody({
        description: 'Dados necessários para abrir a ordem de serviço',
        schema: {
            type: 'object',
            required: ['id_cliente', 'id_ativo', 'descricao_problema'],
            properties: {
                id_cliente: {
                    type: 'number',
                    example: 1,
                    description: 'Identificador do cliente'
                },
                id_ativo: {
                    type: 'number',
                    example: 1,
                    description: 'Identificador do veículo ou equipamento'
                },
                descricao_problema: {
                    type: 'string',
                    example: 'Motor apresentando ruído anormal',
                    minLength: 5,
                    description: 'Descrição do problema relatado'
                }
            }
        }
    })
    @ApiCreatedResponse({
        description: 'Ordem de serviço criada com sucesso'
    })
    @ApiNotFoundResponse({
        description: 'Cliente não encontrado ou ativo não pertence ao cliente'
    })
    @ApiUnauthorizedResponse({
        description: 'Token JWT ausente ou inválido'
    })
    async open(
        @Body(new ZodValidationPipe(openOsSchema)) body: OpenOsDTO,
        @LoggedUser('sub') idLoggedUser: number
    ) {
        const novaOS = await this.openServiceOrderUseCase.execute(body, idLoggedUser)

        return OrdemServicoMapper.toHttp(novaOS)
    }

    @Patch(':id/diagnostico')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Adicionar diagnóstico à ordem de serviço',
        description: 'Registra o diagnóstico do mecânico e avança a ordem de serviço para o status ORCAMENTO_PENDENTE.'
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador da ordem de serviço',
        type: Number,
        example: 1
    })
    @ApiBody({
        description: 'Dados do diagnóstico realizado pelo mecânico',
        schema: {
            type: 'object',
            required: ['diagnostico'],
            properties: {
                diagnostico: {
                    type: 'string',
                    example: 'Necessária a substituição da bomba de combustível',
                    minLength: 5,
                    description: 'Descrição técnica do problema identificado'
                }
            }
        }
    })
    @ApiOkResponse({
        description: 'Diagnóstico registrado e ordem de serviço atualizada com sucesso'
    })
    @ApiNotFoundResponse({
        description: 'Ordem de serviço não encontrada'
    })
    @ApiBadRequestResponse({
        description: 'Dados inválidos ou transição de status não permitida'
    })
    @ApiUnauthorizedResponse({
        description: 'Token JWT ausente ou inválido'
    })
    async adicionarDiagnostico(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(addDiagnosticSchema)) body: AddDiagnosticDTO
    ) {
        const osAtualizada = await this.addDiagnosticUseCase.execute(
            id,
            body.diagnostico
        )

        return OrdemServicoMapper.toHttp(osAtualizada)
    }

    @Patch(':id/orcamento')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Definir orçamento da ordem de serviço',
        description: 'Registra os valores de mão de obra e peças e avança a ordem de serviço para AGUARDANDO_APROVACAO.'
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador da ordem de serviço',
        type: Number,
        example: 1
    })
    @ApiBody({
        description: 'Valores que compõem o orçamento da ordem de serviço',
        schema: {
            type: 'object',
            required: ['valor_mao_obra', 'valor_pecas'],
            properties: {
                valor_mao_obra: {
                    type: 'number',
                    example: 250.00,
                    minimum: 0,
                    description: 'Valor da mão de obra'
                },
                valor_pecas: {
                    type: 'number',
                    example: 180.50,
                    minimum: 0,
                    description: 'Valor total das peças'
                }
            }
        }
    })
    @ApiOkResponse({
        description: 'Orçamento definido e ordem de serviço atualizada com sucesso'
    })
    @ApiNotFoundResponse({
        description: 'Ordem de serviço não encontrada'
    })
    @ApiBadRequestResponse({
        description: 'Dados inválidos ou transição de status não permitida'
    })
    @ApiUnauthorizedResponse({
        description: 'Token JWT ausente ou inválido'
    })
    async definirOrcamento(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(budgetDefineSchema)) body: BudgetDefineDTO
    ) {
        const osAtualizada = await this.budgetDefineUseCase.execute(
            id,
            body
        )

        return OrdemServicoMapper.toHttp(osAtualizada)
    }

    @Patch(':id/iniciar-execucao')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Aprovar orçamento e iniciar execução do serviço',
        description: 'Aprova o orçamento e altera o status da ordem de serviço para EM_EXECUCAO, permitindo o início do serviço.'
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador da ordem de serviço',
        type: Number,
        example: 1
    })
    @ApiOkResponse({
        description: 'Orçamento aprovado e execução do serviço iniciada com sucesso'
    })
    @ApiNotFoundResponse({
        description: 'Ordem de serviço não encontrada'
    })
    @ApiBadRequestResponse({
        description: 'A ordem de serviço não está em um status que permita iniciar a execução'
    })
    @ApiUnauthorizedResponse({
        description: 'Token JWT ausente ou inválido'
    })
    async iniciarExecucao(
        @Param('id', ParseIntPipe) id: number
    ) {
        const osAtualizada = await this.startExecutionUseCase.execute(id)

        return OrdemServicoMapper.toHttp(osAtualizada)
    }


    @ApiOkResponse({
        description: 'Ordem de serviço concluída com sucesso'
    })
    @ApiNotFoundResponse({
        description: 'Ordem de serviço não encontrada'
    })
    @ApiBadRequestResponse({
        description: 'Dados inválidos ou ordem de serviço em status incompatível com a conclusão'
    })
    @ApiUnauthorizedResponse({
        description: 'Token JWT ausente ou inválido'
    })
    async concluirServico(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(finishServiceSchema)) body: FinishServiceDTO
    ) {
        const osConcluida = await this.finishServiceUseCase.execute(
            id,
            body
        )

        return OrdemServicoMapper.toHttp(osConcluida)
    }

    @Post(':id/itens')
    @ApiOperation({
        summary: 'Adiciona uma peça ou serviço à Ordem de Serviço'
    })
    @ApiParam({
        name: 'id',
        description: 'ID da Ordem de Serviço',
        type: Number,
        example: 1
    })
    @ApiBody({
        description: 'Dados do item do catálogo que será adicionado à OS',
        schema: {
            type: 'object',
            required: ['id_catalogo_item', 'quantidade'],
            properties: {
                id_catalogo_item: {
                    type: 'number',
                    example: 5
                },
                quantidade: {
                    type: 'number',
                    example: 2
                }
            }
        }
    })
    @ApiOkResponse({
        description: 'Item adicionado à Ordem de Serviço com sucesso'
    })
    @ApiBadRequestResponse({
        description: 'Dados inválidos ou item inativo'
    })
    @ApiNotFoundResponse({
        description: 'Ordem de Serviço ou item do catálogo não encontrado'
    })
    async adicionarItem(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(addItemOsSchema)) body: AddItemOsDTO
    ) {
        const osAtualizada = await this.addItemOsUseCase.execute(id, body)

        return OrdemServicoMapper.toHttp(osAtualizada)
    }

    @Delete(':id/itens/:idItem')
    @ApiOperation({ summary: 'Remove uma peça ou serviço da Ordem de Serviço' })
    @ApiParam({ name: 'id', description: 'ID da Ordem de Serviço' })
    @ApiParam({ name: 'idItem', description: 'ID do item do catálogo a ser removido' })
    async removerItem(
        @Param('id', ParseIntPipe) serviceOrderId: number,
        @Param('idItem', ParseIntPipe) catalogItemId: number
    ) {
        const serviceOrderAtualizada = await this.removeItemOsUseCase.execute(serviceOrderId, catalogItemId)


        return OrdemServicoMapper.toHttp(serviceOrderAtualizada)
    }

    @Patch(':id/cancelar')
    @ApiOperation({ summary: 'Cancela a Ordem de Serviço (congelando-a)' })
    @ApiParam({ name: 'id', description: 'ID da Ordem de Serviço' })
    async cancelar(@Param('id', ParseIntPipe) id: number) {
        const osCancelada = await this.cancelItemOsUseCase.execute(id)

        return OrdemServicoMapper.toHttp(osCancelada)
    }

    @Post(':id/concluir')
    @ApiOperation({
        summary: 'Concluir ordem de serviço',
        description:
            'Registra a solução aplicada, conclui a OS e realiza a baixa de estoque dos produtos elegíveis.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID da ordem de serviço',
        type: Number,
        example: 1,
    })
    @ApiBody({
        type: CompleteServiceOrderDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Ordem de serviço concluída com sucesso.',
    })
    @ApiResponse({
        status: 400,
        description: 'ID inválido ou dados da requisição inválidos.',
    })
    @ApiResponse({
        status: 404,
        description: 'Ordem de serviço ou produto não encontrado.',
    })
    async concluirOs(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CompleteServiceOrderDto,
    ) {
        const serviceOrder =
            await this.completeServiceOrderUseCase.execute(
                id,
                body.appliedSolution,
            )

        return OrdemServicoMapper.toHttp(serviceOrder)
    }
}
