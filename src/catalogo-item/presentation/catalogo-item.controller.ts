import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UsePipes
} from '@nestjs/common'

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiResponse,
    ApiParam
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../usuario/shared/guards/jwt-auth-guard'
import { ZodValidationPipe } from '../../usuario/shared/pipes/zod-validation-pipe'

import { CreateCatalogItemDTO, createCatalogItemSchema } from '../application/dtos/create-catalog-item.dto'
import { UpdateCatalogItemDTO, updateCatalogItemSchema } from '../application/dtos/update-catalog-item.dto'
import { UpdateStatusCatalogDTO, updateStatusCatalogItemSchema } from '../application/dtos/update-status-catalog-item.dto'

import { CatalogItemMapper } from './mappers/catalog-items.mapper'

import { CreateCatalogItemUseCase } from '../application/use-cases/create-catalog-item-use-case'
import { ListCatalogItemUseCase } from '../application/use-cases/list-catalog-item-use-case'
import { UpdateCatalogItemUseCase } from '../application/use-cases/update-catalog-item-use-case'
import { UpdateStatusCatalogItem } from '../application/use-cases/update-status-catalog-item-use-case'

@ApiTags('Catálogo de Itens')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('catalogo-itens')
export class CatalogoItemController {
    constructor(
        private readonly createCatalogItemUseCase: CreateCatalogItemUseCase,
        private readonly listCatalogItemUseCase: ListCatalogItemUseCase,
        private readonly updateCatalogItemUseCase: UpdateCatalogItemUseCase, 
        private readonly updateStatusCatalogItem: UpdateStatusCatalogItem
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

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Atualizar informações de um item do catálogo'
    })
    @ApiParam({
        name: 'id',
        description: 'ID do item no catálogo',
        type: Number
    })
    @ApiBody({
        description: 'Dados do item que serão atualizados',
        schema: {
            type: 'object',
            properties: {
                descricao: {
                    type: 'string',
                    example: 'Troca de óleo do motor'
                },
                unidade: {
                    type: 'string',
                    example: 'UN'
                },
                valor_unitario: {
                    type: 'number',
                    example: 150.50
                }
            },
            example: {
                descricao: 'Troca de óleo do motor',
                unidade: 'UN',
                valor_unitario: 150.50
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Item atualizado com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro de validação' })
    @ApiResponse({ status: 401, description: 'Não autenticado ou token inválido' })
    @ApiResponse({ status: 404, description: 'Item não encontrado' })
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(updateCatalogItemSchema))
        body: UpdateCatalogItemDTO
    ) {
        const itemAtualizado =
            await this.updateCatalogItemUseCase.execute(id, body)

        return CatalogItemMapper.toHttp(itemAtualizado)
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Ativar ou desativar um item do catálogo (Soft Delete)'
    })
    @ApiParam({
        name: 'id',
        description: 'ID do item no catálogo',
        type: Number
    })
    @ApiBody({
        description: 'Novo status do item',
        schema: {
            type: 'object',
            required: ['ativo'],
            properties: {
                ativo: {
                    type: 'boolean',
                    example: false,
                    description: 'Define se o item está ativo'
                }
            },
            example: {
                ativo: false
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Status do item alterado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Não autenticado ou token inválido' })
    @ApiResponse({ status: 404, description: 'Item não encontrado' })
    async alterarStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(updateStatusCatalogItemSchema))
        body: UpdateStatusCatalogDTO
    ) {
        const itemAtualizado = await this.updateStatusCatalogItem.execute(
            id,
            body.ativo
        )

        return CatalogItemMapper.toHttp(itemAtualizado)
    }
}