/*
  Warnings:

  - The primary key for the `Batch` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_batchId_fkey";

-- AlterTable
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_pkey",
ADD COLUMN     "generatedId" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ADD CONSTRAINT "Batch_pkey" PRIMARY KEY ("generatedId");
DROP SEQUENCE "Batch_id_seq";

-- AlterTable
ALTER TABLE "CSVStatus" ADD COLUMN     "errors" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("generatedId") ON DELETE RESTRICT ON UPDATE CASCADE;
