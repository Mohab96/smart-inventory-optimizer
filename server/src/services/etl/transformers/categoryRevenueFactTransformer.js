const prisma = require("../../../../prisma/dwh/client");

async function categoryRevenueFactTransformer(rawData, date = null) {
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
        categoryId: Number(record.categoryId),
        dateId: Number(dateRecord.dateId),
        revenueAmount: Number(record.totalRevenue || 0),
        totalUnitsSold: Number(record.totalUnitsSold),
      };
    });
    return transformedData;
  } catch (error) {
    console.error("Transformation failed:", error);
  }
}

module.exports = categoryRevenueFactTransformer;
