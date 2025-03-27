/*
  Warnings:

  - You are about to drop the column `dateId` on the `BatchInfo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BatchInfo" DROP CONSTRAINT "BatchInfo_dateId_fkey";

-- AlterTable
ALTER TABLE "BatchInfo" DROP COLUMN "dateId";
