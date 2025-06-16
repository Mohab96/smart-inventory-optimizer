const mainClient = require("../../prisma/main/client");
const dwhClient = require("../../prisma/dwh/client");
const { fetchInsightsData } = require("./insightUtils");

async function getLowStockPrediction({
  businessId,
  days = 7,
  topProducts = 5,
}) {
  if (!businessId) {
    throw new Error("businessId is required");
  }

  const insights = await fetchInsightsData(
    businessId,
    days,
    topProducts,
    mainClient
  );

  if (!Array.isArray(insights)) {
    throw new Error("Expected insights to be an array");
  }

  const productIds = insights.map(({ product }) => product?.id).filter(Boolean);

  if (productIds.length === 0) {
    return [];
  }

  const latestStocks = await dwhClient.inventoryFact.findMany({
    where: { businessId, productId: { in: productIds } },
    orderBy: { dateId: "desc" },
    distinct: ["productId"],
    select: { productId: true, currentStock: true },
  });

  const stockMap = new Map(
    latestStocks.map((stock) => [stock.productId, stock.currentStock || 0])
  );

  const lowStockProducts = insights
    .map(({ product, totalAmount }) => {
      if (
        !product?.id ||
        !product?.name ||
        !product?.categoryRelation?.name ||
        totalAmount === undefined
      ) {
        return null;
      }

      const inventoryStock = stockMap.get(product.id) || 0;
      const predictedStock = totalAmount;
      const difference = predictedStock - inventoryStock;

      return difference > 0
        ? {
            productName: product.name,
            predictedStock,
            inventoryStock,
            difference,
            categoryName: product.categoryRelation.name,
          }
        : null;
    })
    .filter(Boolean);

  const ret = JSON.stringify(lowStockProducts, null, 2);
  return ret;
}

module.exports = { getLowStockPrediction };
