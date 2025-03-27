const winston = require("winston");
const prisma = require("../../../../prisma/dwh/client");

async function batchInfoLoader(transformedData) {
  try {
    const { transofrmedCreateData, transformedUpdateData } = transformedData;

    await prisma.$transaction(async (tx) => {
      // Bulk creation
      if (transofrmedCreateData.length > 0) {
        await tx.BatchInfo.createMany({ data: transofrmedCreateData });
      }

      // Bulk update for `quantity` using raw SQL
      if (transformedUpdateData.length > 0) {
        const updateQuery = `
          UPDATE "BatchInfo"
          SET "quantity" = CASE "batchId"
            ${transformedUpdateData
              .map((data) => `WHEN ${data.batchId} THEN ${data.quantity}`)
              .join(" ")}
          END
          WHERE "batchId" IN (${transformedUpdateData
            .map((data) => data.batchId)
            .join(",")})
        `;
        await tx.$executeRawUnsafe(updateQuery);
      }
    });
  } catch (error) {
    winston.error("Error processing batch data:", error);
  }
}

module.exports = batchInfoLoader;
