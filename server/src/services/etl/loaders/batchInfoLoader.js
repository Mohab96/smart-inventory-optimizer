const winston = require("winston");
const prisma = require("../../../../prisma/dwh/client");

async function batchInfoLoader(transformedData) {
  try {
    await prisma.batchInfo.createMany({
      data: transformedData,
    });
  } catch (error) {
    winston.error("Loading failed:", error);
  }
}

module.exports = batchInfoLoader;
