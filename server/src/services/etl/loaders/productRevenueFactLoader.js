const winston = require("winston");
const prisma = require("../../../../prisma/dwh/client");

const BATCH_SIZE = 5000;

async function productRevenueFactLoader(transformedData) {
  if (!Array.isArray(traynsformedData) || transformedData.length === 0) return;
  try {
    await prisma.$transaction(
      async (tx) => {
        for (let i = 0; i < transformedData.length; i += BATCH_SIZE) {
          const batch = transformedData.slice(i, i + BATCH_SIZE);

          const sqlQuery = `
          INSERT INTO "ProductRevenueFact" ("productId", "businessId", "dateId", "revenueAmount", "totalUnitsSold")
          VALUES ${batch
            .map(
              (_, index) =>
                `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${
                  index * 5 + 4
                }, $${index * 5 + 5})`
            )
            .join(", ")}
          ON CONFLICT ("productId", "businessId", "dateId") DO UPDATE
          SET
            "revenueAmount" = "ProductRevenueFact"."revenueAmount" + EXCLUDED."revenueAmount",
            "totalUnitsSold" = "ProductRevenueFact"."totalUnitsSold" + EXCLUDED."totalUnitsSold";
        `;

          const params = batch.flatMap((record) => [
            record.productId,
            record.businessId,
            record.dateId,
            record.revenueAmount,
            record.totalUnitsSold,
          ]);

          await tx.$executeRawUnsafe(sqlQuery, ...params);
          console.log(
            `Batch ${Math.floor(i / BATCH_SIZE) + 1} loaded successfully.`
          );
        }
      },
      { timeout: 72000 }
    );
  } catch (error) {
    winston.error("Batch loading failed:", error);
  }
}

module.exports = productRevenueFactLoader;
