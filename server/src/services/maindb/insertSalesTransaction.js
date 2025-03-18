const client = require("../../../prisma/main/client");
const _ = require("lodash"); // For splitting arrays into smaller chunks

const insertSalesTransaction = async (data, message) => {
  const batchSize = 10000;
  const updateData = [];
  const transactionData = [];

  console.log("Started inserting sales transactions...");

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
  console.log("Splitting data into chunks...");

  const updateChunks = _.chunk(updateData, batchSize);
  const transactionChunks = _.chunk(transactionData, batchSize);
  console.log("Processing chunks...");

  for (let i = 0; i < updateChunks.length; i++) {
    console.log("Processing chunk", i + 1, "of", updateChunks.length);

    await client.$transaction(
      async (prisma) => {
        await Promise.all(
          updateChunks[i].map(({ generatedId, saleAmount }) => {
            console.log("updating batch", generatedId);
            prisma.batch.update({
              where: { generatedId },
              data: {
                remQuantity: { decrement: saleAmount },
                soldQuantity: { increment: saleAmount },
              },
            });
          })
        );
        console.log("inserting chunk", i + 1);

        await prisma.transaction.createMany({
          data: transactionChunks[i],
        });
        console.log("chunk", i + 1, "inserted successfully");
      },
      { timeout: 720000 }
    );
  }
};

module.exports = insertSalesTransaction;
