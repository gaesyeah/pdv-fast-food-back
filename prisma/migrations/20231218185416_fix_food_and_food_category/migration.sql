/*
  Warnings:

  - You are about to drop the column `frontBackGroundUrl` on the `FoodCategory` table. All the data in the column will be lost.
  - Added the required column `frontBackGroundUrl` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `FoodCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "frontBackGroundUrl" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FoodCategory" DROP COLUMN "frontBackGroundUrl",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
