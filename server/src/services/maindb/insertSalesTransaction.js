const client = require("../../../prisma/main/client");
const getId = require("./getBatchGenId");
const getProductID = require("./getProductID");
///TODO: try to optimize as we did in the purchases transaction
const insertSalesTransaction = async (data, message) => {
  await client.$transaction(async (prisma) => {
    for (const row of data.goodRows) {
      const saleAmount = +row.data.amount;

      // Get product ID first
      const productId = await getProductID(
        row.data.productName,
        message.businessId
      );

      // Get generated batch ID
      const generatedId = await getId(row.data.batchId, productId);

      if (!generatedId) {
        throw new Error(
          `Batch not found for batchId: ${row.data.batchId} and productId: ${productId}`
        );
      }

      // Update batch quantities
      await prisma.batch.update({
        where: { generatedId },
        data: {
          remQuantity: { decrement: saleAmount },
          soldQuantity: { increment: saleAmount },
        },
      });

      // Insert transaction with the correct batchId (generatedId)
      await prisma.transaction.create({
        data: {
          batchId: generatedId, // Use generatedId as foreign key
          date: row.data.date,
          amount: -saleAmount,
          discount: +row.data.discount,
        },
      });
    }
  });
};

module.exports = insertSalesTransaction;
