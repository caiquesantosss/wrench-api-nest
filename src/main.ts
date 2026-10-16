import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { env } from './env/env'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  )

  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('WrenchOS API')
    .setDescription('API de Gestão Integrada de Ordens de Serviço (WDasmaceno)')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Introduza o token JWT gerado no endpoint de login',
        in: 'header',
      },
      'JWT-auth', 
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(env.PORT, '0.0.0.0')
  console.log('🚀 WrenchOS Server on!')
  console.log('📚 Documentação Swagger disponível em http://localhost:3030/api/docs')
}

bootstrap()