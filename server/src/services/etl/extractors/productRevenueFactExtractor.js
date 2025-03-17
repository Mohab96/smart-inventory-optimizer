const prisma = require("../../../../prisma/main/client");

async function productRevenueFactExtractor(date = null) {
  try {
    date = date || new Date(new Date().setDate(new Date().getDate() - 1));
    const startDate = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    const endDate = new Date(new Date(date).setUTCHours(23, 59, 59, 999));

    const targetDate = new Date(date).toISOString().split("T")[0];
    const rawData = await prisma.$queryRaw`
      SELECT 
        p."id" AS "productId",
        p."businessId",
        t."date",
        COALESCE(SUM(-t."amount" * (b."sellingPrice" * (1 - t."discount" / 100.0))), 0) AS "revenueAmount",
        COALESCE(SUM(ABS(t."amount")), 0) AS "totalUnitsSold"
      FROM "Product" p
      LEFT JOIN "Batch" b ON p."id" = b."productId"
      LEFT JOIN "Transaction" t ON b."generatedId" = t."batchId" 
        AND DATE(t."createdAt") >= ${startDate}::date
        AND DATE(t."createdAt") <= ${endDate}::date
        AND t."amount" < 0
      GROUP BY p."id", p."businessId", t."date"
    `;
    return rawData;
  } catch (error) {
    console.error("Extraction failed:", error);
  }
}

module.exports = productRevenueFactExtractor;
