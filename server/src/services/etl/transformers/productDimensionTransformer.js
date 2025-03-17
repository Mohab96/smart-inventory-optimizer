function productDimensionTransformer(rawData) {
  try {
    const transformedData = rawData.map((row) => ({
      productId: Number(row.id),
      name: row.name,
      categoryId: Number(row.categoryId),
      businessId: row.businessId,
    }));
    return transformedData;
  } catch (error) {
    console.error("Transformation failed:", error);
  }
}

module.exports = productDimensionTransformer;
