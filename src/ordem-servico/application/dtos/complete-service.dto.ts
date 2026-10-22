import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CompleteServiceOrderDto {
  @ApiProperty({
    description: 'Descrição da solução aplicada na ordem de serviço',
    example:
      'Substituição do componente defeituoso e teste de funcionamento.',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  appliedSolution: string
}