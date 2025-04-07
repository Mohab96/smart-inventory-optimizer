const axios = require("axios");
const winston = require("winston");
const mainClient = require("../../prisma/main/client");
const { fetchInsightsData } = require("../utils/insightUtils");

const getLowStockPrediction = async (req, res) => {
  const { businessId } = req.user;
  console.log(req.user);
  if (!businessId) {
    return res.status(400).send({ error: "Invalid request" });
  }

  try {
    const insights = await fetchInsightsData(
      req.user.businessId,
      Number(7),
      Number(5),
      mainClient
    );

    const productIds = insights.map((item) => item.product.id);

    const productsInDWH = await dwhClient.product.findMany({
      where: { id: { in: productIds } },
      include: { batches: true },
    });

    const stockMap = new Map();
    for (const product of productsInDWH) {
      const totalQuantity = product.batches.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );
      stockMap.set(product.id, totalQuantity);
    }

    const lowStockProducts = [];

    for (const item of insights) {
      const predictedQuantity = item.totalAmount;
      const availableStock = stockMap.get(item.product.id) || 0;

      if (predictedQuantity > availableStock) {
        lowStockProducts.push({
          product: item.product,
          predictedQuantity,
          availableStock,
          shortage: predictedQuantity - availableStock,
        });
      }
    }

    lowStockProducts.sort((a, b) => a.shortage - b.shortage); // ascending
    return res.status(200).send({ data: insights });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).send({ error: error.message });
    }
  }
};
module.exports = { getLowStockPrediction };
