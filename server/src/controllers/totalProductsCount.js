const dwhClient = require("../../prisma/dwh/client");

const getTotalProductsCount = async (req, res, next) => {
  const businessId = req.user.businessId;

  try {
    const totalProducts = await dwhClient.productDimension.count({
      where: {
        businessId: businessId,
      },
    });

    return res.status(200).json({
      data: totalProducts,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports = getTotalProductsCount; 