const client = require("../../../prisma/main/client");
const _ = require("lodash"); // For splitting arrays into smaller chunks
const { trainModel } = require("../../controllers/insights");

const insertSalesTransaction = async (data, message) => {
  const batchSize = 10000;
  const updateData = [];
  const transactionData = [];

  for (const row of data.goodRows) {
    const saleAmount = +row.data.amount;
    const productId = row.data.productId;
    const generatedId = row.data.generatedId;

    updateData.push({
      generatedId,
      saleAmount,
    });

    transactionData.push({
      batchId: generatedId,
      date: row.data.date,
      amount: -saleAmount,
      discount: +row.data.discount,
    });
  }

  const updateChunks = _.chunk(updateData, batchSize);
  const transactionChunks = _.chunk(transactionData, batchSize);

  for (let i = 0; i < updateChunks.length; i++) {
    await client.$transaction(
      async (prisma) => {
        await Promise.all(
          updateChunks[i].map(({ generatedId, saleAmount }) => {
            prisma.batch.update({
              where: { generatedId },
              data: {
                remQuantity: { decrement: saleAmount },
                soldQuantity: { increment: saleAmount },
              },
            });
          })
        );

        await prisma.transaction.createMany({
          data: transactionChunks[i],
        });
      },
      { timeout: 720000 }
    );
  }

  await trainModel(message.businessId);
};

module.exports = insertSalesTransaction;
