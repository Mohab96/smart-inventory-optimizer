const dwhClient = require("../../prisma/dwh/client");

const getTotalCategoriesCount = async (req, res, next) => {
  const businessId = req.user.businessId;

  try {
    const totalCategories = await dwhClient.categoryDimension.count();

    return res.status(200).json({
      data: totalCategories,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports = getTotalCategoriesCount;
