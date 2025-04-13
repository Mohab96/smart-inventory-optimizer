const dwhClient = require("../../prisma/dwh/client");
const winston = require("winston");

const getProductsExpiringSoon = async (req, res, next) => {
  const businessId = req.user.businessId;
  if (!businessId) {
    return res.status(400).send({ error: "Invalid request" });
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

    return res.status(200).json({
      data: results,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports = getProductsExpiringSoon;
