const client = require("../../../prisma/main/client");

const insertPurchasesTransactions = async (data) => {
  await client.$transaction(
    async (prisma) => {
      // Prepare the batch data from the goodRows
      const batchesData = data.goodRows.map((row) => ({
        // Note: `id` here is provided by your CSV data.
        // If your DB generates the primary key (and you don't need the value in advance),
        // you can omit it.
        id: +row.data.batchId,
        productId: +row.data.productId,
        expiryDate: row.data.expiryDate,
        dateOfReceipt: row.data.dateOfReceipt,
        costOfGoods: row.data.costOfGoods,
        sellingPrice: row.data.sellingPrice,
        soldQuantity: 0,
        remQuantity: row.data.quantity,
      }));

      // Bulk insert batches using createMany.
      // This returns a count of inserted rows.
      const batchInsertResult = await prisma.batch.createMany({
        data: batchesData,
        skipDuplicates: true, // optional: skip if there are duplicates
      });
      console.log("Batches inserted:", batchInsertResult.count);

      // Prepare the transactions data.
      // Here, we assume that the batchId you supplied in the CSV can be used for linking.
      // If you need the auto-generated IDs from the batch table, you'll have to adjust your strategy.
      const transactionsData = data.goodRows.map((row) => ({
        batchId: +row.data.batchId, // Use the same ID as inserted (if it's provided, not auto-generated)
        date: row.data.dateOfReceipt,
        amount: +row.data.quantity,
        discount: 0,
      }));

      // Bulk insert transactions using createMany.
      const transactionsInsertResult = await prisma.transaction.createMany({
        data: transactionsData,
      });
      console.log("Transactions inserted:", transactionsInsertResult.count);
    },
    { timeout: 720000 }
  );
};

module.exports = insertPurchasesTransactions;
