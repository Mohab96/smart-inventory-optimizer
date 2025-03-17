const winston = require("winston");
const prisma = require("../../../../prisma/dwh/client");

async function productRevenueFactLoader(transformedData) {
  try {
    await prisma.productRevenueFact.createMany({
      data: transformedData,
    });
  } catch (error) {
    winston.error("Loading failed:", error);
  }
}

module.exports = productRevenueFactLoader;
