/*
  Warnings:

  - The primary key for the `CategoryRevenueFact` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CategoryRevenueFact" DROP CONSTRAINT "CategoryRevenueFact_pkey",
ADD CONSTRAINT "CategoryRevenueFact_pkey" PRIMARY KEY ("businessId", "categoryId", "dateId");
