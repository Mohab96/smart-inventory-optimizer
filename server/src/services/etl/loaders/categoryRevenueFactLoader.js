const winston = require("winston");
const prisma = require("../../../../prisma/dwh/client");

async function categoryRevenueFactLoader(transformedData) {
  try {
    // Start a transaction
    await prisma.$transaction(
      async (tx) => {
        // Construct the SQL query for batch upsert
        const sqlQuery = `
        INSERT INTO "CategoryRevenueFact" ("businessId", "categoryId", "dateId", "revenueAmount", "totalUnitsSold")
        VALUES ${transformedData
          .map(
            (record, index) =>
              `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${
                index * 5 + 4
              }, $${index * 5 + 5})`
          )
          .join(", ")}
        ON CONFLICT ("businessId", "categoryId", "dateId") DO UPDATE
        SET
          "revenueAmount" = "CategoryRevenueFact"."revenueAmount" + EXCLUDED."revenueAmount",
          "totalUnitsSold" = "CategoryRevenueFact"."totalUnitsSold" + EXCLUDED."totalUnitsSold";
      `;

        // Flatten the transformedData into an array of parameters
        const params = transformedData.flatMap((record) => [
          record.businessId,
          record.categoryId,
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

module.exports = categoryRevenueFactLoader;
