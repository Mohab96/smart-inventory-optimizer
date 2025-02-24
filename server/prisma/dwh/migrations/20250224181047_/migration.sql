/*
  Warnings:

  - You are about to drop the column `expiry_date` on the `BatchInfo` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_price` on the `BatchInfo` table. All the data in the column will be lost.
  - You are about to drop the column `selling_price` on the `BatchInfo` table. All the data in the column will be lost.
  - Added the required column `expiryDate` to the `BatchInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchasePrice` to the `BatchInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingPrice` to the `BatchInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BatchInfo" DROP COLUMN "expiry_date",
DROP COLUMN "purchase_price",
DROP COLUMN "selling_price",
ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "purchasePrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "sellingPrice" DECIMAL(65,30) NOT NULL;
