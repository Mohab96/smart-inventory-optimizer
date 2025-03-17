const winston = require("winston");
const prisma = require("../../../../prisma/dwh/client");

async function transactionFactLoader(transformedData) {
  try {
    await prisma.transactionFact.createMany({
      data: transformedData,
    });
  } catch (error) {
    winston.error("Loading failed:", error);
  }
}

module.exports = transactionFactLoader;
