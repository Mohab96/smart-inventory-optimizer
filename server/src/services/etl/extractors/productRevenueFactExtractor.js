const prisma = require("../../../../prisma/main/client");

async function productRevenueFactExtractor() {
  // 1. Get transactions happened yesterday
  const yesterdayStart = new Date(new Date().setDate(new Date().getDate() - 1));
  yesterdayStart.setHours(0, 0, 0, 0);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: yesterdayStart.toISOString(),
        lt: todayStart.toISOString(),
      },
    },
  });

  // 2. Get batches referenced in transactions
  const referencedBatches = transactions.map(
    (transaction) => transaction.batchId
  );

  const batches = await prisma.batch.findMany({
    where: {
      generatedId: {
        in: referencedBatches,
      },
    },
  });

  // 3. Get products referenced in batches
  const referencedProducts = batches.map((batch) => batch.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: referencedProducts,
      },
    },
  });

  return { transactions, batches, products };
}

module.exports = productRevenueFactExtractor;
