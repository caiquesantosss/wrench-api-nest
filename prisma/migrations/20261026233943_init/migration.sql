-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "documento" VARCHAR(14) NOT NULL,
    "telefone" VARCHAR(20),
    "email" VARCHAR(100),
    "endereco" VARCHAR(255),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "perfil" VARCHAR(20) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "ativo" (
    "id_ativo" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "descricao" VARCHAR(150) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "marca" VARCHAR(80),
    "modelo" VARCHAR(80),
    "identificacao" VARCHAR(100),
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ativo_pkey" PRIMARY KEY ("id_ativo")
);

-- CreateTable
CREATE TABLE "catalogo_item" (
    "id_catalogo_item" SERIAL NOT NULL,
    "descricao" VARCHAR(150) NOT NULL,
    "tipo_item" VARCHAR(20) NOT NULL,
    "unidade" VARCHAR(20),
    "valor_unitario" DECIMAL(12,2) NOT NULL,
    "estoque_atual" DECIMAL(12,3),
    "estoque_minimo" DECIMAL(12,3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalogo_item_pkey" PRIMARY KEY ("id_catalogo_item")
);

-- CreateTable
CREATE TABLE "ordem_servico" (
    "id_ordem_servico" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_ativo" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "descricao_problema" TEXT NOT NULL,
    "diagnostico" TEXT,
    "solucao_aplicada" TEXT,
    "valor_mao_obra" DECIMAL(12,2),
    "valor_pecas" DECIMAL(12,2),
    "valor_total" DECIMAL(12,2),
    "data_abertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_previsao" TIMESTAMP(3),
    "data_conclusao" TIMESTAMP(3),
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordem_servico_pkey" PRIMARY KEY ("id_ordem_servico")
);

-- CreateTable
CREATE TABLE "item_os" (
    "id_item_os" SERIAL NOT NULL,
    "id_ordem_servico" INTEGER NOT NULL,
    "id_catalogo_item" INTEGER NOT NULL,
    "quantidade" DECIMAL(12,3) NOT NULL,
    "valor_unitario" DECIMAL(12,2) NOT NULL,
    "valor_total" DECIMAL(12,2) NOT NULL,
    "status_aprovacao" VARCHAR(20),
    "baixa_estoque" BOOLEAN NOT NULL DEFAULT false,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_os_pkey" PRIMARY KEY ("id_item_os")
);

-- CreateTable
CREATE TABLE "financeiro" (
    "id_financeiro" SERIAL NOT NULL,
    "id_ordem_servico" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "tipo_lancamento" VARCHAR(20) NOT NULL,
    "status_pagamento" VARCHAR(20) NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "forma_pagamento" VARCHAR(30),
    "referencia_externa" VARCHAR(150),
    "data_vencimento" DATE,
    "data_pagamento" TIMESTAMP(3),
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financeiro_pkey" PRIMARY KEY ("id_financeiro")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id_auditoria" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tabela_afetada" VARCHAR(100) NOT NULL,
    "operacao" VARCHAR(20) NOT NULL,
    "registro_id" INTEGER NOT NULL,
    "descricao" TEXT,
    "dados_anteriores" JSONB,
    "dados_novos" JSONB,
    "data_evento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id_auditoria")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_documento_key" ON "cliente"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "ativo" ADD CONSTRAINT "ativo_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordem_servico" ADD CONSTRAINT "ordem_servico_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordem_servico" ADD CONSTRAINT "ordem_servico_id_ativo_fkey" FOREIGN KEY ("id_ativo") REFERENCES "ativo"("id_ativo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordem_servico" ADD CONSTRAINT "ordem_servico_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_os" ADD CONSTRAINT "item_os_id_ordem_servico_fkey" FOREIGN KEY ("id_ordem_servico") REFERENCES "ordem_servico"("id_ordem_servico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_os" ADD CONSTRAINT "item_os_id_catalogo_item_fkey" FOREIGN KEY ("id_catalogo_item") REFERENCES "catalogo_item"("id_catalogo_item") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financeiro" ADD CONSTRAINT "financeiro_id_ordem_servico_fkey" FOREIGN KEY ("id_ordem_servico") REFERENCES "ordem_servico"("id_ordem_servico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
