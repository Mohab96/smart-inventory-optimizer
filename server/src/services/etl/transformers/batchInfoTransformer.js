const prisma = require("../../../../prisma/dwh/client");

async function batchInfoTransformer(rawData) {
  try {
    const { createData, updateData } = rawData;

    const transformedCreateData = createData.map((row) => ({
      batchId: Number(row.generatedId),
      productId: Number(row.productId),
      businessId: row.productRelation.businessId,
      quantity: Number(row.remQuantity),
      purchasePrice: Number(row.costOfGoods),
      sellingPrice: Number(row.sellingPrice),
      expiryDate: row.expiryDate,
    }));
    const transformedUpdateData = updateData.map((row) => ({
      batchId: Number(row.generatedId),
      productId: Number(row.productId),
      businessId: row.productRelation.businessId,
      quantity: Number(row.remQuantity),
      purchasePrice: Number(row.costOfGoods),
      sellingPrice: Number(row.sellingPrice),
      expiryDate: row.expiryDate,
    }));

    return { transformedCreateData, transformedUpdateData };
  } catch (error) {
    console.error("Transformation failed:", error);
  }
}

module.exports = batchInfoTransformer;
