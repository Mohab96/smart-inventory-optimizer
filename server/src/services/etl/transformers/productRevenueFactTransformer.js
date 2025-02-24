const prisma = require("../../../../prisma/main/client");

async function productRevenueFactTransformer(rawData) {
  const { transactions, batches, products } = rawData;

  const productsCounter = {};
  const productsRevenue = {};
  const productBusiness = {};

  for (const record of transactions) {
    const { amount, discount, batchId } = record;

    const batch = batches[batchId];
    const product = products[batch.productId];

    productsCounter[product.id] = (productsCounter[product.id] || 0) + 1;

    const revenue = amount * batch.sellingPrice * (discount / 100);
    productsRevenue[product.id] = (productsRevenue[product.id] || 0) + revenue;

    productBusiness[product.id] = product.businessId;
  }

  const date = new Date();
  date.setDate(date.getDate() - 1);

  const dateId = await prisma.date.findFirst({
    where: {
      date: date.toISOString().split("T")[0],
    },
  }).id;

  const transformedData = Object.keys(productsCounter).map((productId) => {
    return {
      dateId,
      productId,
      businessId: productBusiness[productId],
      totalUnitsSold: productsCounter[productId],
      revenueAmount: productsRevenue[productId],
    };
  });

  return transformedData;
}

module.exports = productRevenueFactTransformer;
