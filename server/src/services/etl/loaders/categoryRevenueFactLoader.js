const winston = require("winston/lib/winston/config");
const prisma = require("../../../../prisma/dwh/client");

async function categoryRevenueFactLoader(transformedData) {
  try {
    await prisma.categoryRevenueFact.createMany({
      data: transformedData,
    });
  } catch (error) {
    winston.error(error);
  }
}

module.exports = categoryRevenueFactLoader;
