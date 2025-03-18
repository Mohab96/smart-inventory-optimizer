const prisma = require("../../../../prisma/main/client");

async function batchInfoExtractor(date = null) {
  try {
    // Default to yesterday if no dates provided
    date = date || new Date(new Date().setDate(new Date().getDate() - 1));
    const startDate = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    const endDate = new Date(new Date(date).setUTCHours(23, 59, 59, 999));

    const rawData = await prisma.batch.findMany({
      where: {
        lastModified: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        generatedId: true, //TODO: where is the other id?
        productId: true,
        remQuantity: true,
        costOfGoods: true,
        sellingPrice: true,
        expiryDate: true,
        productRelation: {
          select: {
            businessId: true,
          },
        },
      },
    });
    return rawData;
  } catch (error) {
    console.error("Extraction failed:", error);
    throw error;
  }
}

module.exports = batchInfoExtractor;
