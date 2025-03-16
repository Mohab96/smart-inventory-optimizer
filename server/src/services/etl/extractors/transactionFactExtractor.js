const prisma = require("../../../../prisma/main/client");

async function transactionFactExtractor(date = null) {
  try {
    // Default to yesterday if no dates provided
    date = date || new Date(new Date().setDate(new Date().getDate() - 1));
    const startDate = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    const endDate = new Date(new Date(date).setUTCHours(23, 59, 59, 999));

    const rawData = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        amount: true,
        discount: true,
        batchRelation: {
          select: {
            productId: true,
            productRelation: {
              select: {
                businessId: true,
              },
            },
          },
        },
      },
    });
    return rawData;
  } catch (error) {
    console.error("Extraction failed:", error);
  }
}

module.exports = transactionFactExtractor;
