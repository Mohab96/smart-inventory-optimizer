const winston = require("winston");
const prisma = require("../../../../prisma/dwh/client");

async function productRevenueFactLoader(transformedData) {
  try {
    // Start a transaction
    await prisma.$transaction(
      async (tx) => {
        // Construct the SQL query for batch upsert
        const sqlQuery = `
        INSERT INTO "ProductRevenueFact" ("productId", "businessId", "dateId", "revenueAmount", "totalUnitsSold")
        VALUES ${transformedData
          .map(
            (record, index) =>
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

        // Flatten the transformedData into an array of parameters
        const params = transformedData.flatMap((record) => [
          record.productId,
          record.businessId,
          record.dateId,
          record.revenueAmount,
          record.totalUnitsSold,
        ]);

        // Execute the raw SQL query
        await tx.$executeRawUnsafe(sqlQuery, ...params);
      },
      { timeout: 72000 }
    );
  } catch (error) {
    winston.error("Batch loading failed:", error);
  }
}

module.exports = productRevenueFactLoader;
