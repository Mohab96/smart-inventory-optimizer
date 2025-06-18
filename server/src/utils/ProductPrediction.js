const mainClient = require("../../prisma/main/client");
const dwhClient = require("../../prisma/dwh/client");

const { fetchInsightsData } = require("./insightUtils");

async function getProductPredection({ businessId, days = 7, topProducts = 5 }) {
  if (!businessId) {
    throw new Error("businessId is required");
  }

  const insights = await fetchInsightsData(
    businessId,
    days,
    topProducts,
    dwhClient
  );

  if (!Array.isArray(insights)) {
    throw new Error("Expected insights to be an array");
  }

  const filteredData = insights
    .map((item) => {
      if (!item.product || !item.product.category.categoryName) return null;
      return {
        productName: item.product.name,
        categoryName: item.product.category.categoryName,
        totalAmount: item.totalAmount,
      };
    })
    .filter((item) => item !== null);
  const ret = JSON.stringify(filteredData, null, 2);
  return ret;
}

module.exports = { getProductPredection };
