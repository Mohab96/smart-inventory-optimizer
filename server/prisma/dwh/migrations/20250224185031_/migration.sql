/*
  Warnings:

  - The primary key for the `BatchInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "BatchInfo" DROP CONSTRAINT "BatchInfo_pkey",
ADD COLUMN     "batchId" SERIAL NOT NULL,
ADD CONSTRAINT "BatchInfo_pkey" PRIMARY KEY ("batchId");
