const winston = require("winston");
const prisma = require("../../../../prisma/dwh/client");

async function categoryRevenueFactLoader(transformedData) {
  try {
    await prisma.categoryRevenueFact.createMany({
      data: transformedData,
    });
  } catch (error) {
    winston.error("Loading failed:", error);
  }
}

module.exports = categoryRevenueFactLoader;
