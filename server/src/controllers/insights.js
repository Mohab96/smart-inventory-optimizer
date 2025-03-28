const axios = require("axios");
const winston = require("winston");
const mainClient = require("../../prisma/main/client");

const getInsights = async (req, res) => {
  const predictionsEndpoint = process.env.MODEL_BASE_URL + "/atom/predict";
  const { numberOfProducts, daysOfForecasting } = req.body;

  if (!numberOfProducts || !daysOfForecasting) {
    return res.status(400).send({ error: "Invalid request" });
  }

  try {
    const body = {
      business_id: req.user.businessId,
      days_of_forcasting: +daysOfForecasting,
      top_number_of_product: +numberOfProducts,
    };

    const response = await axios.post(predictionsEndpoint, body);

    if (response.status >= 400) {
      return res.status(response.status).send({
        error: response.data.error || "Prediction service error",
      });
    }

    const { high_demand_products } = response.data;
    
    const finalProducts = [];

    for (const product of high_demand_products) {
      const productData = await mainClient.product.findUnique({
        where: { id: product.product_id },
        include: {
          categoryRelation: true,
        },
      });

      finalProducts.push({
        product: productData,
        dailySales: product.forecast,
        totalAmount: product.total_forecast,
      });
    }

    res.status(200).send({ data: finalProducts });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Service returned error response
        winston.error(
          `Prediction service error ${error.response.status}:`,
          error.response.data
        );
        res.status(error.response.status).send({
          error: error.response.data.error || "Prediction service error",
        });
      } else if (error.request) {
        // No response received
        winston.error("Prediction service unavailable:", error.message);
        res.status(503).send({ error: "Prediction service unavailable" });
      } else {
        // Request setup error
        winston.error("Request setup error:", error.message);
        res.status(500).send({ error: "Internal server error" });
      }
    } else {
      // General server error
      winston.error("Server error:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  }
};

const trainModel = async (business_id) => {
  try {
    const trainingEndpoint = process.env.MODEL_BASE_URL + "/atom/train";
    const body = { business_id };

    // Make the POST request with proper error handling
    const response = await axios.post(trainingEndpoint, body);

    // Verify successful response
    if (response.status >= 400) {
      throw new Error(`Training failed with status ${response.status}`);
    }

    return; // Or return response data if required
  } catch (error) {
    // Handle different error types
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server returned an error response
        winston.error(
          `Training endpoint error ${error.response.status}:`,
          error.response.data
        );
        
      } else if (error.request) {
        // No response received (network issue)
        winston.error("Training endpoint unreachable:", error.message);
      } else {
        // Request setup error
        winston.error("Request error:", error.message);
      }
    } else {
      // General server error
      winston.error("Unexpected error during training:", error);
    }
  }
};

module.exports = { getInsights, trainModel };
