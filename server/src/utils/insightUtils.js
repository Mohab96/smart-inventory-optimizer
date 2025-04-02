const axios = require('axios');

async function fetchInsightsData(businessId, daysOfForecasting, numberOfProducts, mainClient) {
  const predictionsEndpoint = process.env.MODEL_BASE_URL + "/atom/predict";
  
  const response = await axios.post(predictionsEndpoint, {
    business_id: businessId,
    days_of_forcasting: daysOfForecasting,
    top_number_of_product: numberOfProducts,
  });

  if (response.status >= 400) {
    const error = new Error(response.data?.error || 'Prediction service error');
    error.status = response.status;
    throw error;
  }

  const { high_demand_products } = response.data;
  const finalProducts = [];

  for (const product of high_demand_products) {
    const productData = await mainClient.product.findUnique({
      where: { id: product.product_id },
      include: { categoryRelation: true },
    });

    finalProducts.push({
      product: productData,
      dailySales: product.forecast,
      totalAmount: product.total_forecast,
    });
  }

  return finalProducts;
}

module.exports = { fetchInsightsData };