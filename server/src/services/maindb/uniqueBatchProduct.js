const client = require("../../../prisma/main/client");
const unique = async (batchId, productId) => {
  const exist = await client.batch.findFirst({
    where: {
      productId: productId,
      id: batchId,
    },
  });
  return exist;
};
module.exports = unique;
