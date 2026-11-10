
import { NestFactory } from "@nestjs/core"
import { AppModule } from "../src/app.module"
import { PrismaService } from "../src/prisma/prisma.service"
import bcrypt from "bcryptjs"

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule)

  try {
    const prisma = app.get(PrismaService)

    const email = "admin@wrenchos.com"

    const adminExistente = await prisma.usuario.findUnique({
      where: { email },
    })

    if (adminExistente) {
      console.log("O administrador já existe. Nenhuma alteração foi realizada.")
      return
    }

    const senhaHash = await bcrypt.hash("Mudar@123", 10)

    const admin = await prisma.usuario.create({
      data: {
        nome: "Administrador Master",
        email,
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
  console.error("Erro ao executar seed:", error)
  process.exitCode = 1
})
