const prisma = require("../../../../prisma/dwh/client");

async function inventoryFactTransformer(rawData, date = null) {
  try {
    date = date || new Date(new Date().setDate(new Date().getDate() - 1));

    const dateRecord = await prisma.DateDimension.findFirst({
      where: {
        fullDate: date,
      },
      select: { dateId: true },
    });
    if (!dateRecord) {
      throw new Error(`No DateDimension entry for ${date}`);
    }
    const transformedData = rawData.map((record) => {
      return {
        businessId: record.businessId,
        productId: record.productId,
        dateId: dateRecord.dateId,
        currentStock: record.currentStock,
      };
    });
    return transformedData;
  } catch (error) {
    console.error("Transformation failed:", error);
  }
}

module.exports = inventoryFactTransformer;
