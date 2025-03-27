const winston = require("winston");
const prisma = require("../../../../prisma/dwh/client");

async function batchInfoLoader(transformedData) {
  try {
    const { transformedCreateData, transformedUpdateData } = transformedData;

    await prisma.$transaction(
      async (tx) => {
        // Bulk creation
        if (transformedCreateData.length > 0) {
          await tx.BatchInfo.createMany({ data: transformedCreateData });
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
      },
      { timeout: 72000 }
    );
  } catch (error) {
    winston.error("Error processing batch data:", error);
  }
}

module.exports = batchInfoLoader;
