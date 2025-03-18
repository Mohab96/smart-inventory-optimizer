/*
  Warnings:

  - Added the required column `batchId` to the `TransactionFact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionFact" ADD COLUMN     "batchId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TransactionFact" ADD CONSTRAINT "TransactionFact_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "BatchInfo"("batchId") ON DELETE RESTRICT ON UPDATE CASCADE;
