const client = require("../../../prisma/main/client");

const getId = async (batchId, productId) => {
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
};
module.exports = getId;
