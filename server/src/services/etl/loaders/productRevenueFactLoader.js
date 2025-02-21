const winston = require("winston/lib/winston/config");
const prisma = require("../../../../prisma/dwh/client");

async function productRevenueFactLoader(transformedData) {
  try {
    await prisma.productRevenueFact.createMany({
      data: transformedData,
      skipDuplicates: true,
    });
  } catch (error) {
    winston.error(error);
  }
}

module.exports = productRevenueFactLoader;
