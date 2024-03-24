/*
  Warnings:

  - You are about to drop the column `onwer_id` on the `wallets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_id]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_id` to the `wallets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_onwer_id_fkey";

-- DropIndex
DROP INDEX "wallets_onwer_id_key";

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "onwer_id",
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "wallets_owner_id_key" ON "wallets"("owner_id");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
