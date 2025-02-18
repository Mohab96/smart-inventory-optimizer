const client = require("../../../prisma/main/client");
const insertPurchasesTransactions = async (data) => {
  await client.$transaction(async (prisma) => {
    // Insert batches one by one to get the generated IDs
    const createdBatches = await Promise.all(
      data.goodRows.map((row) =>
        prisma.batch.create({
          data: {
            id: +row.data.batchId,
            productId: +row.data.productId,
            expiryDate: row.data.expiryDate,
            dateOfReceipt: row.data.dateOfReceipt,
            costOfGoods: row.data.costOfGoods,
            sellingPrice: row.data.sellingPrice,
            soldQuantity: 0,
            remQuantity: row.data.quantity,
          },
          select: { generatedId: true }, // Get the generated batch ID
        })
      )
    );

    // Map transactions using the newly created batch IDs
    const transactions = createdBatches.map((batch, index) => ({
      batchId: batch.generatedId, // Use the generated batch ID
      date: data.goodRows[index].data.dateOfReceipt,
      amount: +data.goodRows[index].data.quantity,
      discount: 0,
    }));

    // Insert transactions
    await prisma.transaction.createMany({ data: transactions });
  });
};
module.exports = insertPurchasesTransactions;
