/*
  Warnings:

  - Added the required column `quantity` to the `BatchInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BatchInfo" ADD COLUMN     "quantity" INTEGER NOT NULL;
