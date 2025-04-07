const axios = require("axios");
const winston = require("winston");
const mainClient = require("../../prisma/main/client");


const { fetchInsightsData, fetchDiscounts } = require("../utils/insightUtils");

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

    const response = await axios.post(trainingEndpoint, body);

    if (response.status >= 400) {
      throw new Error(`Training failed with status ${response.status}`);
    }

    return;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        winston.error(
          `Training endpoint error ${error.response.status}:`,
          error.response.data
        );
      } else if (error.request) {
        winston.error("Training endpoint unreachable:", error.message);
      } else {
        winston.error("Request error:", error.message);
      }
    } else {
      winston.error("Unexpected error during training:", error);
    }
  }
};

const getDiscounts = async (req, res) => {
  const businessId = req.user.businessId;
  const limit = req.query.limit || 10;

  try {
    const discounts = await fetchDiscounts(businessId, limit, mainClient);
    return res.status(200).send({ data: discounts });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).send({ error: error.message });
    }

    if (axios.isAxiosError(error)) {
      if (error.response) {
        winston.error(
          `Discount service error ${error.response.status}:`,
          error.response.data
        );
        return res.status(error.response.status).send({
          error: error.response.data?.error || "Discount service error",
        });
      }

      if (error.request) {
        winston.error("Discount service unavailable:", error.message);
        return res.status(503).send({ error: "Discount service unavailable" });
      }
    }

    winston.error("Server error:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = { getInsights, trainModel, getDiscounts };
