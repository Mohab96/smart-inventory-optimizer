const winston = require("winston");
const prisma = require("../../../../prisma/dwh/client");

async function inventoryFactLoader(transformedData) {
  try {
    await prisma.inventoryFact.createMany({
      data: transformedData,
    });
  } catch (error) {
    winston.error("Loading failed:", error);
  }
}

module.exports = inventoryFactLoader;
