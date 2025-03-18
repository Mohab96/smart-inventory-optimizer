-- DropForeignKey
ALTER TABLE "ProductDimension" DROP CONSTRAINT "ProductDimension_categoryId_fkey";

-- AlterTable
ALTER TABLE "BatchInfo" ALTER COLUMN "expiryDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductDimension" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductDimension" ADD CONSTRAINT "ProductDimension_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryDimension"("categoryId") ON DELETE SET NULL ON UPDATE CASCADE;
