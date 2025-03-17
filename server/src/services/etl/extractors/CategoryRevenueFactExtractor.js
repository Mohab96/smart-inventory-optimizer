const prisma = require("../../../../prisma/main/client");

async function categoryRevenueFactExtractor(date = null) {
  try {
    date = date || new Date(new Date().setDate(new Date().getDate() - 1));
    const startDate = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    const endDate = new Date(new Date(date).setUTCHours(23, 59, 59, 999));

    const rawData = await prisma.$queryRaw`
        SELECT 
          c."id" AS "categoryId",
          p."businessId",
          t."date",
          COALESCE(SUM(-t."amount" * (b."sellingPrice" * (1 - t."discount" / 100.0))), 0) AS "revenueAmount",
          COALESCE(SUM(-t."amount"), 0) AS "totalUnitsSold"
        FROM "Category" c
        LEFT JOIN "Product" p ON c."id" = p."categoryId"
        LEFT JOIN "Batch" b ON p."id" = b."productId"
        LEFT JOIN "Transaction" t ON b."generatedId" = t."batchId" 
          AND t."amount" < 0 
          AND DATE(t."createdAt") >= ${startDate}::date
          AND DATE(t."createdAt") <= ${endDate}::date
        WHERE
          p."businessId" IS NOT NULL
        GROUP BY c."id", p."businessId",t."date"
      `;
    return rawData;
  } catch (error) {
    console.error("Extraction failed:", error);
  }
}

module.exports = categoryRevenueFactExtractor;
