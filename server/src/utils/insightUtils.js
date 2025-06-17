const axios = require("axios");
const winston = require("winston");

async function fetchInsightsData(
  businessId,
  daysOfForecasting,
  numberOfProducts,
  dbclient
) {
  const predictionsEndpoint = process.env.MODEL_BASE_URL + "/atom/predict";

  const response = await axios.post(predictionsEndpoint, {
    business_id: businessId,
    days_of_forcasting: daysOfForecasting,
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
    console.log(product);

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
    process.env.MODEL_BASE_URL + "/predict_discount?businessId=" + businessId;

  const response = await axios.get(discountsEndpoint);
  const { discounts } = await response.data;

  const newDiscounts = discounts.slice(0, limit);
  const finalDiscounts = [];

  for (const discount of newDiscounts) {
    const batch = await mainClient.batch.findUnique({
      where: { generatedId: discount.batchId },
      include: { productRelation: true },
    });

    const category = await mainClient.category.findUnique({
      where: { id: batch.productRelation.categoryId },
    });

    finalDiscounts.push({
      productName: discount.productName,
      suggestedDiscount: discount.suggested_discount,
      categoryName: category.name,
      batchId: discount.batchId,
      productPrice: batch.sellingPrice,
      productPriceAfterDiscount:
        +batch.sellingPrice -
        (+batch.sellingPrice * +discount.suggested_discount) / 100,
      productId: batch.productRelation.id,
    });
  }

  return finalDiscounts;
};

module.exports = { fetchInsightsData, fetchDiscounts };
