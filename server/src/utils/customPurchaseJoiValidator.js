const getProductID = require("../services/maindb/getProductID");
const unique = require("../services/maindb/uniqueBatchProduct");

const isPresent = async (value, helpers) => {
  const { businessId } = helpers.prefs.context;
  const productName = value;
  const productId = await getProductID(productName, businessId);
  if (!productId) return helpers.error("any.custom");

  return productId;
};

const checkUniqueness = async (value, helpers) => {
  const { productName, batchId } = value;
  const { businessId } = helpers.prefs.context;
  const productId = await getProductID(productName, businessId);
  if (!productId) return helpers.error("any.custom");
  const exist = await unique(batchId, productId);
  if (exist) return helpers.error("any.custom");

  return { ...value, productId: productId };
};

module.exports = { isPresent, checkUniqueness };
