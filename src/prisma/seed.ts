import { NestFactory } from "@nestjs/core"
import { AppModule } from "../app.module"
import { PrismaService } from "./prisma.service"
import bcrypt from "bcryptjs"

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule)

  try {
    const prisma = app.get(PrismaService)

    const senhaHash = await bcrypt.hash("Mudar@123", 10)

    const admin = await prisma.usuario.upsert({
      where: {
        email: "admin@wrenchos.com",
      },
      update: {},
      create: {
        nome: "Administrador Master",
        email: "admin@wrenchos.com",
        senha_hash: senhaHash,
        perfil: "GERENTE",
      },
    })

    console.log("Primeiro administrador criado com sucesso!")
    console.log(admin)
  } finally {
    await app.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})