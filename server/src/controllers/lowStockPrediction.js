const axios = require("axios");
const winston = require("winston");
const mainClient = require("../../prisma/main/client");
const { fetchInsightsData } = require("../utils/insightUtils");
const dwhClient = require("../../prisma/dwh/client");

const getLowStockPrediction = async (req, res) => {
  const businessId = req.user?.businessId;
  if (!businessId) {
    return res.status(400).send({ error: "Invalid request" });
  }

  try {
    const insights = await fetchInsightsData(businessId, 7, 5, mainClient); // 7 days, top 5 products

    if (!Array.isArray(insights)) {
      throw new Error("Expected insights to be an array");
    }
    const productIds = insights
      .map(({ product }) => product.id)
      .filter(Boolean);
    if (!productIds.length) {
      return res.status(200).send({ data: [] }); // No products to process
    }
    const latestStocks = await dwhClient.inventoryFact.findMany({
      where: {
        businessId: businessId,
        productId: { in: productIds },
      },
      orderBy: {
        dateId: "desc",
      },
      distinct: ["productId"],
      select: {
        productId: true,
        currentStock: true,
      },
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
          console.warn("Skipping item due to missing fields:", product);
          return null;
        }

        const inventoryStock = stockMap.get(product.id) || 0;
        const predictedStock = totalAmount;
        const difference = predictedStock - inventoryStock;
        // diffrance >0 means this product have low stock
        return {
          productName: product.name,
          predictedStock,
          inventoryStock,
          difference,
          categoryName: product.categoryRelation.name,
        };
      })
      .filter((item) => item !== null && item.difference > 0);

    return res.status(200).send({ data: lowStockProducts });
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
module.exports = { getLowStockPrediction };
