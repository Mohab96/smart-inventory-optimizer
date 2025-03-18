const prisma = require("../../../../prisma/main/client");

async function productDimensionExtractor(date = null) {
  try {
    // Default to yesterday if no dates provided
    date = date || new Date(new Date().setDate(new Date().getDate() - 1));
    const startDate = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    const endDate = new Date(new Date(date).setUTCHours(23, 59, 59, 999));

    const rawData = await prisma.product.findMany({
      where: {
        lastModified: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        name: true,
        categoryId: true,
        businessId: true,
      },
    });
    return rawData;
  } catch (error) {
    console.error("Extraction failed:", error);
  }
}

module.exports = productDimensionExtractor;
