const axios = require("axios");
const dwhClient = require("../../prisma/dwh/client");

async function fetchInsightsData(
  businessId,
  daysOfForecasting,
  numberOfProducts,
  dbclient
) {
  const predictionsEndpoint = process.env.MODEL_BASE_URL + "/atom/predict";

  const response = await axios.post(predictionsEndpoint, {
    business_id: businessId,
    days_of_forecasting: daysOfForecasting,
    top_number_of_product: numberOfProducts,
  });

  if (response.status >= 400) {
    const error = new Error(response.data?.error || "Prediction service error");
    error.status = response.status;
    throw error;
  }

  const { high_demand_products } = response.data;
  const finalProducts = [];

  for (const product of high_demand_products) {
    const productData = await dbclient.productDimension.findUnique({
      where: { productId: product.product_id },
      include: { category: true },
    });

    finalProducts.push({
      product: productData,
      dailySales: product.forecast,
      totalAmount: product.total_forecast,
    });
  }

  return finalProducts;
}

const fetchDiscounts = async (businessId, limit, mainClient) => {
  const discountsEndpoint =
    process.env.DISCOUNTS_MODEL_BASE_URL +
    "/predict_discount?businessId=" +
    businessId;

  const response = await axios.get(discountsEndpoint);
  const { discounts } = await response.data;
  const newDiscounts = discounts.slice(0, limit);
  const finalDiscounts = [];

  for (const discount of newDiscounts) {
    const product = await dwhClient.productDimension.findUnique({
      where: { productId: discount.productId },
    });

    const category = await dwhClient.categoryDimension.findUnique({
      where: { categoryId: product.categoryId },
    });
    finalDiscounts.push({
      productName: discount.productName,
      suggestedDiscount: discount.suggestedDiscount,
      categoryName: category.categoryName,
      batchId: discount.batchId,
      productPrice: discount.productPrice,
      productPriceAfterDiscount: discount.productPriceAfterDiscount,
      productId: discount.productId,
    });
  }

  return finalDiscounts;
};

module.exports = { fetchInsightsData, fetchDiscounts };
