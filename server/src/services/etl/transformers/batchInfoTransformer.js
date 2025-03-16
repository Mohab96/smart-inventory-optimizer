const prisma = require("../../../../prisma/dwh/client");

async function batchInfoTransformer(rawData, date = null) {
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
      batchId: Number(row.generatedId),
      productId: Number(row.productId),
      businessId: row.product.businessId,
      dateId: dateRecord.id,
      quantity: Number(row.remQuantity),
      purchasePrice: Number(row.costOfGoods),
      sellingPrice: Number(row.sellingPrice),
      expiryDate: row.expiryDate,
    }));
    return transformedData;
  } catch (error) {
    console.error("Transformation failed:", error);
    throw error;
  }
}

module.exports = batchInfoTransformer;
