/*
  Warnings:

  - You are about to drop the column `code` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_code_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "code",
ALTER COLUMN "status" SET DEFAULT 'PREPARING';
