import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { env } from './env/env'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );
  
  await app.listen(env.PORT, '0.0.0.0')
  console.log('🚀 WrenchOS Server a correr com NestJS + Fastify na porta 3333');
}
bootstrap();