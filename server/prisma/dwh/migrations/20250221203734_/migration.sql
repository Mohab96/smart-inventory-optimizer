/*
  Warnings:

  - You are about to drop the column `nextExpiryDateId` on the `ProductDimension` table. All the data in the column will be lost.
  - You are about to drop the column `purchasePrice` on the `TransactionFact` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `TransactionFact` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fullDate]` on the table `DateDimension` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProductDimension" DROP CONSTRAINT "ProductDimension_nextExpiryDateId_fkey";

-- AlterTable
ALTER TABLE "ProductDimension" DROP COLUMN "nextExpiryDateId";

-- AlterTable
ALTER TABLE "TransactionFact" DROP COLUMN "purchasePrice",
DROP COLUMN "sellingPrice";

-- CreateIndex
CREATE UNIQUE INDEX "DateDimension_fullDate_key" ON "DateDimension"("fullDate");
