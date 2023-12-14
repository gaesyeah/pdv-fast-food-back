/*
  Warnings:

  - Added the required column `description` to the `Extra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Extra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Extra" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "description" TEXT NOT NULL;
