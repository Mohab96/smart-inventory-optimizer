const prisma = require("../../../../prisma/main/client");

async function inventoryFactExtractor(date = null) {
  try {
    date = date || new Date(new Date().setDate(new Date().getDate() - 1));
    const targetDate = new Date(date).toISOString().split("T")[0];
    const rawData = await prisma.$queryRaw`
      SELECT 
        p."id" AS "productId",
        p."businessId",
        COALESCE(SUM(t."amount"), 0) AS "currentStock"
      FROM "Product" p
      LEFT JOIN "Batch" b ON p."id" = b."productId"
      LEFT JOIN "Transaction" t ON b."generatedId" = t."batchId" 
        AND DATE(t."date") <= ${targetDate}::date
      GROUP BY p."id", p."businessId"
    `;
    return rawData;
  } catch (error) {
    console.error("Extraction failed:", error);
    throw error;
  }
}

module.exports = inventoryFactExtractor;
