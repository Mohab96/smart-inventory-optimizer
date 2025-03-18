const prisma = require("../../../../prisma/main/client");

async function transactionFactExtractor(date = null) {
  try {
    // Default to yesterday if no dates provided
    date = date || new Date(new Date().setDate(new Date().getDate() - 1));
    const startDate = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    const endDate = new Date(new Date(date).setUTCHours(23, 59, 59, 999));

    let allData = [];
    let cursor = null;
    let hasMore = true;
    const batchSize = 25000;
    var i = 0;

    while (hasMore) {
      const rawData = await prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          amount: true,
          discount: true,
          date: true,
          batchId: true,
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
        take: batchSize,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }), // Skip the cursor row itself
        orderBy: { id: "asc" }, // Ensure consistent ordering
      });
      console.log("allData.length: " + allData.length + "     loop: " + i);
      i++;
      allData = allData.concat(rawData);
      hasMore = rawData.length === batchSize;
      cursor = rawData.length > 0 ? rawData[rawData.length - 1].id : null;
    }
    return allData;
  } catch (error) {
    console.error("Extraction failed:", error);
  }
}

module.exports = transactionFactExtractor;
