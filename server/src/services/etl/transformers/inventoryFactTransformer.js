const prisma = require("../../../../prisma/dwh/client");

async function inventoryFactTransformer(rawData) {
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
      productId: record.productId,
      dateId: dateId.dateId,
      currentStock: record.currentStock,
    };
  });
  return transformedData;
}

module.exports = inventoryFactTransformer;
