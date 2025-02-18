/*
  Warnings:

  - You are about to drop the `BatchPrice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BatchPrice" DROP CONSTRAINT "BatchPrice_businessId_fkey";

-- DropForeignKey
ALTER TABLE "BatchPrice" DROP CONSTRAINT "BatchPrice_dateId_fkey";

-- DropForeignKey
ALTER TABLE "BatchPrice" DROP CONSTRAINT "BatchPrice_productId_fkey";

-- DropTable
DROP TABLE "BatchPrice";

-- CreateTable
CREATE TABLE "BatchInfo" (
    "productId" INTEGER NOT NULL,
    "businessId" TEXT NOT NULL,
    "dateId" INTEGER NOT NULL,
    "purchase_price" DECIMAL(65,30) NOT NULL,
    "selling_price" DECIMAL(65,30) NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatchInfo_pkey" PRIMARY KEY ("productId","businessId")
);

-- AddForeignKey
ALTER TABLE "BatchInfo" ADD CONSTRAINT "BatchInfo_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "DateDimension"("dateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchInfo" ADD CONSTRAINT "BatchInfo_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "BusinessDimension"("businessId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchInfo" ADD CONSTRAINT "BatchInfo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDimension"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
