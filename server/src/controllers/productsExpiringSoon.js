const dwhClient = require("../../prisma/dwh/client");

const getProductsExpiringSoon = async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const order = req.query.orderBy || "asc";
  const businessId = req.user.businessId;

  const currentDate = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  try {
    const groupedBatches = await dwhClient.batchInfo.groupBy({
      by: ["productId", "expiryDate"],
      where: {
        businessId: businessId,
        expiryDate: {
          gt: currentDate,
          lte: oneMonthLater,
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        expiryDate: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    // Extract the product IDs from the group results.
    const productIds = groupedBatches.map((group) => group.productId);

    // Query the ProductDimension table to get product names.
    const products = await dwhClient.productDimension.findMany({
      where: {
        productId: { in: productIds },
      },
      select: {
        productId: true,
        name: true,
      },
    });

    const productMap = {};
    products.forEach((p) => {
      productMap[p.productId] = p.name;
    });

    // Each entry includes the product name, aggregated quantity, and expiry date.
    const results = groupedBatches.map((group) => ({
      productId: group.productId,
      productName: productMap[group.productId] || null,
      expiryDate: group.expiryDate,
      quantity: group._sum.quantity,
    }));

    return res.status(200).json({
      data: results,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports = getProductsExpiringSoon;
