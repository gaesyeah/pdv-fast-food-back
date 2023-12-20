/*
  Warnings:

  - You are about to drop the column `observation` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FoodOrder" ADD COLUMN     "observation" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "observation";
