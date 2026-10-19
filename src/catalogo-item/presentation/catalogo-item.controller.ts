import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards
} from '@nestjs/common'

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../usuario/shared/guards/jwt-auth-guard'
import { ZodValidationPipe } from '../../usuario/shared/pipes/zod-validation-pipe'
import { CreateCatalogItemDTO, createCatalogItemSchema } from '../application/dtos/create-catalog-item.dto'
import { CatalogItemMapper } from './mappers/catalog-items.mapper'

import { CreateCatalogItemUseCase } from '../application/use-cases/create-catalog-item-use-case'
import { ListCatalogItemUseCase } from '../application/use-cases/list-catalog-item-use-case'

@ApiTags('Catálogo de Itens')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('catalogo-itens')
export class CatalogoItemController {
    constructor(
        private readonly createCatalogItemUseCase: CreateCatalogItemUseCase,
        private readonly listCatalogItemUseCase: ListCatalogItemUseCase
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Cadastrar item no catálogo',
        description: 'Cadastra um novo produto ou serviço no catálogo de itens.'
    })
    @ApiBody({
        description: 'Dados necessários para cadastrar um produto ou serviço',
        schema: {
            type: 'object',
            required: [
                'descricao',
                'tipo_item',
                'unidade',
                'valor_unitario'
            ],
            properties: {
                descricao: {
                    type: 'string',
                    example: 'Óleo de motor 5W30',
                    minLength: 3,
                    description: 'Descrição do produto ou serviço'
                },
                tipo_item: {
                    type: 'string',
                    enum: ['PRODUTO', 'SERVICO'],
                    example: 'PRODUTO',
                    description: 'Tipo do item cadastrado'
                },
                unidade: {
                    type: 'string',
                    example: 'UN',
                    description: 'Unidade de medida, como UN, LT ou HR'
                },
                valor_unitario: {
                    type: 'number',
                    example: 89.90,
                    minimum: 0,
                    description: 'Valor unitário do item'
                },
                estoque_atual: {
                    type: 'number',
                    example: 10,
                    minimum: 0,
                    default: 0,
                    description: 'Quantidade disponível em estoque'
                },
                estoque_minimo: {
                    type: 'number',
                    example: 2,
                    minimum: 0,
                    default: 0,
                    description: 'Quantidade mínima desejada em estoque'
                }
            }
        }
    })
    @ApiCreatedResponse({
        description: 'Item cadastrado com sucesso'
    })
    @ApiBadRequestResponse({
        description: 'Dados inválidos para cadastrar o item'
    })
    @ApiUnauthorizedResponse({
        description: 'Token JWT ausente ou inválido'
    })
    async cadastrar(
        @Body(new ZodValidationPipe(createCatalogItemSchema))
        body: CreateCatalogItemDTO
    ) {
        const novoItem = await this.createCatalogItemUseCase.execute(body)

        return CatalogItemMapper.toHttp(novoItem)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Listar itens ativos do catálogo'
    })
    async listarAtivos() {
        const itens = await this.listCatalogItemUseCase.execute()

        return itens.map(CatalogItemMapper.toHttp)
    }
}