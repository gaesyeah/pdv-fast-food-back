/*
  Warnings:

  - You are about to drop the `OrderExtras` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderExtras" DROP CONSTRAINT "OrderExtras_extraId_fkey";

-- DropForeignKey
ALTER TABLE "OrderExtras" DROP CONSTRAINT "OrderExtras_foodOrderId_fkey";

-- DropTable
DROP TABLE "OrderExtras";

-- CreateTable
CREATE TABLE "OrderFoodExtras" (
    "id" SERIAL NOT NULL,
    "foodOrderId" INTEGER NOT NULL,
    "extraId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderFoodExtras_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderFoodExtras" ADD CONSTRAINT "OrderFoodExtras_foodOrderId_fkey" FOREIGN KEY ("foodOrderId") REFERENCES "FoodOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFoodExtras" ADD CONSTRAINT "OrderFoodExtras_extraId_fkey" FOREIGN KEY ("extraId") REFERENCES "Extra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
