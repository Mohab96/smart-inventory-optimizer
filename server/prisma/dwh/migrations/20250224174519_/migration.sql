/*
  Warnings:

  - Added the required column `businessId` to the `ProductDimension` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductDimension" ADD COLUMN     "businessId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductDimension" ADD CONSTRAINT "ProductDimension_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessDimension"("businessId") ON DELETE RESTRICT ON UPDATE CASCADE;
