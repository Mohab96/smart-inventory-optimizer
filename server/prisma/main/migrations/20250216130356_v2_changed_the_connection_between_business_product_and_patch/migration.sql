/*
  Warnings:

  - You are about to drop the column `businessId` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the column `Image` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_businessId_fkey";

-- DropIndex
DROP INDEX "Product_name_key";

-- AlterTable
ALTER TABLE "Batch" DROP COLUMN "businessId";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "Image",
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "businessId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
