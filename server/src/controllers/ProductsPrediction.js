const axios = require("axios");
const winston = require("winston");
const mainClient = require("../../prisma/main/client");
const { fetchInsightsData } = require("../utils/insightUtils");

const getPrediction = async (req, res) => {
  const businessId = req.user?.businessId;
  if (!businessId) {
    return res.status(400).send({ error: "Invalid request" });
  }

  try {
    const insights = await fetchInsightsData(businessId, 7, 5, mainClient);
    if (!Array.isArray(insights)) {
      throw new Error("Expected insights to be an array");
    }

    const filteredData = insights
      .map((item) => {
        return {
          productName: item.product.name,
          categoryName: item.product.categoryRelation.name,
          totalAmount: item.totalAmount,
        };
      })
      .filter((item) => item !== null);

    return res.status(200).send({ data: filteredData });
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
module.exports = { getPrediction };
