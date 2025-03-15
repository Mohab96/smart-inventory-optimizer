const prisma = require("../../../../prisma/main/client");

async function categoryRevenueFactExtractor(date = null) {
  try {
    if (!date) date = new Date(new Date().setDate(new Date().getDate() - 1)); //TODO: remove this
    const targetDate = new Date(date).toISOString().split("T")[0];
    const rawData = await prisma.$queryRaw`
        SELECT
            p."businessId",
            p."categoryId",
            SUM(-t."amount" * (b."sellingPrice" * (1 - t."discount" / 100.0))) AS "revenueAmount",
            SUM(-t."amount") AS "totalUnitsSold"
        FROM
            "Transaction" t
        JOIN
            "Batch" b ON t."batchId" = b.id
        JOIN
            "Product" p ON b."productId" = p.id
        WHERE
            t."amount" < 0
        AND
            DATE(t."date") = CAST(${targetDate} AS DATE)
        GROUP BY
            p."businessId", p."categoryId"
      `;
    return rawData;
  } catch (error) {
    console.error("Extraction failed:", error);
    throw error; //TODO: Handle error
  }
}

module.exports = categoryRevenueFactExtractor;
