const axios = require("axios");
const winston = require("winston");
const mainClient = require("../../prisma/main/client");

const { fetchInsightsData } = require("../utils/insightUtils");

const getInsights = async (req, res) => {
  const { numberOfProducts, daysOfForecasting } = req.query;

  if (!numberOfProducts || !daysOfForecasting) {
    return res.status(400).send({ error: "Invalid request" });
  }

  try {
    const finalProducts = await fetchInsightsData(
      req.user.businessId,
      Number(daysOfForecasting),
      Number(numberOfProducts),
      mainClient
    );

    return res.status(200).send({ data: finalProducts });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).send({ error: error.message });
    }

    if (axios.isAxiosError(error)) {
      if (error.response) {
        winston.error(
          `Prediction service error ${error.response.status}:`,
          error.response.data
        );
        return res.status(error.response.status).send({
          error: error.response.data?.error || "Prediction service error",
        });
      }

      if (error.request) {
        winston.error("Prediction service unavailable:", error.message);
        return res
          .status(503)
          .send({ error: "Prediction service unavailable" });
      }
    }

    winston.error("Server error:", error);
    return res.status(500).send({ error: "Internal server error" });
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
