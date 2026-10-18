import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards
} from '@nestjs/common'

import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../usuario/shared/guards/jwt-auth-guard'
import { LoggedUser } from '../../usuario/shared/decorators/logged-user-decorator'
import { ZodValidationPipe } from '../../usuario/shared/pipes/zod-validation-pipe'

import { OpenServiceOrderUseCase } from '../application/use-cases/open-service-order-use-case'
import { OpenOsDTO, openOsSchema } from '../application/dtos/open-os.dto'
import { OrdemServicoMapper } from './mappers/ordem-serico.mappers'

@ApiTags('Ordem de Serviço')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ordens-servico')
export class OrdemServicoController {
    constructor(
        private readonly openServiceOrderUseCase: OpenServiceOrderUseCase
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
}
