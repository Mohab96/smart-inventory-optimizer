const prisma = require("../../../../prisma/dwh/client");

async function transactionFactTransformer(rawData, date = null) {
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
      transactionId: Number(row.id),
      businessId: row.batchRelation.productRelation.businessId,
      productId: Number(row.batchRelation.productId),
      dateId: dateRecord.dateId,
      amount: Number(row.amount),
      discount: Number(row.discount),
    }));
    return transformedData;
  } catch (error) {
    console.error("Transformation failed:", error);
  }
}

module.exports = transactionFactTransformer;
