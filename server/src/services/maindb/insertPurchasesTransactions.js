const client = require("../../../prisma/main/client");

const insertPurchasesTransactions = async (data, businessId) => {
  await client.$transaction(
    async (prisma) => {
      const batchesData = data.goodRows.map((row) => ({
        id: +row.data.batchId,
        productId: +row.data.productId,
        expiryDate: row.data.expiryDate,
        dateOfReceipt: row.data.dateOfReceipt,
        costOfGoods: row.data.costOfGoods,
        sellingPrice: row.data.sellingPrice,
        soldQuantity: 0,
        remQuantity: row.data.quantity,
      }));

      const values = batchesData
        .map(
          (b) =>
            `(${b.id}, ${b.productId}, '${b.expiryDate}', '${b.dateOfReceipt}', ${b.costOfGoods}, ${b.sellingPrice}, ${b.soldQuantity}, ${b.remQuantity})`
        )
        .join(", ");

      const insertQuery = `
        INSERT INTO "Batch"("id", "productId", "expiryDate", "dateOfReceipt", "costOfGoods", "sellingPrice", "soldQuantity", "remQuantity")
        VALUES ${values}
        ON CONFLICT DO NOTHING
        RETURNING "generatedId", "id", "productId";
      `;

      const insertedBatches = await prisma.$queryRawUnsafe(insertQuery);

      console.log("Batches inserted:", insertedBatches.length);

      const batchMap = new Map();
      for (const batch of insertedBatches) {
        const compositeKey = `${batch.id}-${batch.productId}`;
        batchMap.set(compositeKey, batch.generatedId);
      }

      const transactionsData = data.goodRows.map((row) => {
        const csvBatchId = +row.data.batchId;
        const csvProductId = +row.data.productId;
        const compositeKey = `${csvBatchId}-${csvProductId}`;
        const autoBatchId = batchMap.get(compositeKey);
        return {
          batchId: autoBatchId,
          date: row.data.dateOfReceipt,
          amount: +row.data.quantity,
          discount: 0,
        };
      });

      const transactionsInsertResult = await prisma.transaction.createMany({
        data: transactionsData,
        skipDuplicates: true,
      });
      console.log("Transactions inserted:", transactionsInsertResult.count);
    },
    { timeout: 960000 }
  );
};

module.exports = insertPurchasesTransactions;
