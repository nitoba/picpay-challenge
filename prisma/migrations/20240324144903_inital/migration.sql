-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('Costumer', 'Retailer');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL DEFAULT 'CPF',
    "document_number" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "owner_id" TEXT NOT NULL,
    "type" "WalletType" NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "source_wallet_id" TEXT NOT NULL,
    "destination_wallet_id" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_document_number_key" ON "users"("document_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_document_number_document_type_key" ON "users"("document_number", "document_type");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_owner_id_key" ON "wallets"("owner_id");

-- CreateIndex
CREATE INDEX "transactions_source_wallet_id_destination_wallet_id_idx" ON "transactions"("source_wallet_id", "destination_wallet_id");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_source_wallet_id_fkey" FOREIGN KEY ("source_wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_destination_wallet_id_fkey" FOREIGN KEY ("destination_wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
