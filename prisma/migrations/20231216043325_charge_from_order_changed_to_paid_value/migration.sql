/*
  Warnings:

  - You are about to drop the column `change` on the `Order` table. All the data in the column will be lost.
  - Added the required column `paidValue` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "change",
ADD COLUMN     "paidValue" DECIMAL(65,30) NOT NULL;
