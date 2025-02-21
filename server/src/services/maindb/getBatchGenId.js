const client = require("../../../prisma/main/client");

const getId = async (batchId, productId) => {
  try {
    const batch = await client.batch.findFirst({
      where: {
        productId: productId,
        id: batchId,
      },
      select: {
        generatedId: true,
      },
    });
    return batch ? batch.generatedId : null;
  } catch (error) {
    return null;
  }
};
module.exports = getId;
