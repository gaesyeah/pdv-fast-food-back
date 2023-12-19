/*
  Warnings:

  - Added the required column `imageUrl` to the `Extra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Extra" ADD COLUMN     "imageUrl" TEXT NOT NULL;
