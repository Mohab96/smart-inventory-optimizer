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

      const batchInsertResult = await prisma.batch.createMany({
        data: batchesData,
        skipDuplicates: true,
      });

      const insertedBatches = await prisma.batch.findMany({
        where: {
          productRelation: {
            businessId: businessId,
          },
        },
        select: {
          id: true,
          productId: true,
          generatedId: true,
        },
      });

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
    },
    { timeout: 720000 }
  );
};

module.exports = insertPurchasesTransactions;
