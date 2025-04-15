const dwhClient = require("../../prisma/dwh/client");

async function expiringSoon({ businessId }) {
  if (!businessId) {
    throw new Error("invalid businessId");
  }
  const currentDate = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  try {
    const expiringProducts = await dwhClient.batchInfo.groupBy({
      by: ["productId"],
      where: {
        businessId: businessId,
        expiryDate: {
          gt: currentDate,
          lte: oneMonthLater,
        },
      },
      _min: {
        expiryDate: true,
      },
      orderBy: {
        _min: {
          expiryDate: "asc",
        },
      },
      take: 5, // Limit to 5 products
    });

    const productData = expiringProducts.map((group) => ({
      productId: group.productId,
      earliestExpiryDate: group._min.expiryDate,
    }));
    const productIds = productData.map((p) => p.productId);

    const products = await dwhClient.productDimension.findMany({
      where: {
        productId: { in: productIds },
      },
      include: {
        category: true,
      },
    });

    const productMap = {};
    products.forEach((p) => {
      productMap[p.productId] = p;
    });

    const results = productData
      .map((pd) => {
        const product = productMap[pd.productId];
        if (!product) {
          return null;
        }
        return {
          productName: product.name,
          categoryName: product.category?.categoryName || "Uncategorized",
          expiryDate: pd.earliestExpiryDate,
        };
      })
      .filter((item) => item !== null);

    const ret = JSON.stringify(results, null, 2);
    return ret;
  } catch (ex) {
    next(ex);
  }
}

module.exports = { expiringSoon };
