const prisma = require("../../../../prisma/dwh/client");

async function productRevenueFactTransformer(rawData, date = null) {
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

    const transformedData = rawData.map((row) => ({
      productId: Number(row.productId),
      businessId: row.businessId,
      dateId: dateRecord.dateId,
      revenueAmount: Number(row.revenueAmount),
      totalUnitsSold: Number(row.totalUnitsSold),
    }));

    return transformedData;
  } catch (error) {
    console.error("Transformation failed:", error);
    throw error;
  }
}
module.exports = productRevenueFactTransformer;
