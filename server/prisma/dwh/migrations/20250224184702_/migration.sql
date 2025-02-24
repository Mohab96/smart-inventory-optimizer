/*
  Warnings:

  - The primary key for the `ProductRevenueFact` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ProductRevenueFact" DROP CONSTRAINT "ProductRevenueFact_pkey",
ADD CONSTRAINT "ProductRevenueFact_pkey" PRIMARY KEY ("productId", "businessId", "dateId");
