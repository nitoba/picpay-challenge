-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_owner_id_fkey";

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
