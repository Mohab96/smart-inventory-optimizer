-- CreateIndex
CREATE INDEX "Batch_productId_id_idx" ON "Batch"("productId", "id");

-- CreateIndex
CREATE INDEX "Batch_id_idx" ON "Batch"("id");

-- CreateIndex
CREATE INDEX "Product_businessId_idx" ON "Product"("businessId");
