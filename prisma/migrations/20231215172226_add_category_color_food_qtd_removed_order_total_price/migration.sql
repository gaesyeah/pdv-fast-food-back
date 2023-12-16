/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Order` table. All the data in the column will be lost.
  - Added the required column `frontBackGroundUrl` to the `FoodCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `FoodOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FoodCategory" ADD COLUMN     "frontBackGroundUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FoodOrder" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalPrice";
