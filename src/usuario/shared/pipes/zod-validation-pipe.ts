import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Erro de validação',
          statusCode: 400,
          errors: error.format()
        });
      }

      console.error('Erro no ZodValidationPipe (Schema pode estar undefined):', error);
      throw new BadRequestException('Falha interna ao processar a validação.');
    }
  }
}