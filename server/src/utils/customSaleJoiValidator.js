const client = require("../../prisma/main/client");
const getProductID = require("../services/maindb/getProductID");

const salesTransactionValidator = async (value, helpers) => {
  const { businessId } = helpers.prefs.context;
  const { batchId, productName, amount } = value;

  const productID = await getProductID(productName, businessId);
  if (!productID)
    return helpers.error("any.invalid", { message: "Product not found." });

  // Find the product that has this name and is associated with a batch that has the given batchId
  const batch = await client.batch.findFirst({
    where: {
      productId: productID,
      id: batchId,
    },
  });
  if (!batch)
    return helpers.error("any.invalid", { message: "Batch not found." });

  if (amount > batch.remQuantity)
    return helpers.error("any.invalid", {
      message: "Sale amount exceeds batch remaining quantity.",
    });

  if (value.date < batch.receiptDate)
    return helpers.error("any.invalid", {
      message: "Sale date must be after the receipt date.",
    });

  return { ...value, productId: productID, batchInfo: batch };
};

module.exports = { salesTransactionValidator };
