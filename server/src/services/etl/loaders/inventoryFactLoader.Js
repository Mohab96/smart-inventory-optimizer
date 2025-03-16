const winston = require("winston/lib/winston/config");
const prisma = require("../../../../prisma/dwh/client");

async function inventoryFactLoader(transformedData) {
  try {
    await prisma.categoryRevenueFact.createMany({
      data: transformedData,
    });
  } catch (error) {
    winston.error("Loading failed:", error);
  }
}

module.exports = inventoryFactLoader;
