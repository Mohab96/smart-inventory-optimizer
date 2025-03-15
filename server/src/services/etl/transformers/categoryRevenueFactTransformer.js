const prisma = require("../../../../prisma/dwh/client");

async function categoryRevenueFactTransformer(rawData) {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  const dateId = await prisma.DateDimension.findFirst({
    where: {
      fullDate: date,
    },
    select: { dateId: true },
  });
  const transformedData = rawData.map((record) => {
    return {
      businessId: record.businessId,
      categoryId: record.categoryId,
      dateId: dateId.dateId,
      revenueAmount: record.totalRevenue,
      totalUnitsSold: record.totalUnitsSold,
    };
  });
  return transformedData;
}

module.exports = categoryRevenueFactTransformer;
