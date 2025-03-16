const winston = require("winston/lib/winston/config");
const prisma = require("../../../../prisma/dwh/client");

async function productDimensionLoader(transformedData) {
  try {
    await prisma.productDimension.createMany({
      data: transformedData,
    });
  } catch (error) {
    winston.error("Loading failed:", error);
  }
}

module.exports = productDimensionLoader;
