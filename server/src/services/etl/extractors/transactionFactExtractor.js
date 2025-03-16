const prisma = require("../../../../prisma/main/client");

async function transactionFactExtractor(startDate = null, endDate = null) {
  try {
    // Default to yesterday if no dates provided
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    startDate = startDate
      ? new Date(startDate)
      : new Date(new Date(yesterday).setUTCHours(0, 0, 0, 0));
    endDate = endDate
      ? new Date(endDate)
      : new Date(new Date(yesterday).setUTCHours(23, 59, 59, 999));

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
        batch: {
          select: {
            productId: true,
            product: {
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
