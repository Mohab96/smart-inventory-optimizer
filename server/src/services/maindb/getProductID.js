const client = require("../../../prisma/main/client");

module.exports = async (productName, businessID) => {
  try {
    const product = await client.product.findFirst({
      where: {
        name: productName,
        businessId: businessID,
      },
      select: {
        id: true,
      },
    });

    return product?.id || null;
  } catch (error) {
    throw new Error(`Error fetching product ID: ${error.message}`);
  }
};
