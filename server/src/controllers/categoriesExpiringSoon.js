const dwhClient = require("../../prisma/dwh/client");

const getCategoriesExpiringSoon = async (req, res, next) => {
  //  pagination (default: page 1, 10 items per page, ascending order)
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const order = "asc";
  const businessId = req.user.businessId;
  const currentDate = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  try {
    // Group batches by productId and expiryDate that match the date filter,
    // summing the quantities for each group.
    const groupedBatches = await dwhClient.batchInfo.groupBy({
      by: ["productId", "expiryDate"],
      where: {
        businessId,
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

    // Get all product IDs from the grouped batches
    const productIds = groupedBatches.map((batch) => batch.productId);

    // Fetch product details including the categoryId
    const products = await dwhClient.productDimension.findMany({
      where: {
        productId: { in: productIds },
      },
      select: {
        productId: true,
        name: true,
        categoryId: true,
      },
    });

    // map ==> quick lookup of product details by productId
    const productMap = {};
    products.forEach((product) => {
      productMap[product.productId] = product;
    });

    // Group the batch results by category and then by product
    const categoryMap = {};

    groupedBatches.forEach((batch) => {
      const product = productMap[batch.productId];
      if (!product) return;

      const catId = product.categoryId;
      // Initialize the category group if not already present
      if (!categoryMap[catId]) {
        categoryMap[catId] = {
          categoryId: catId,
          products: {},
        };
      }

      // Initialize the product within this category if not already present
      if (!categoryMap[catId].products[product.productId]) {
        categoryMap[catId].products[product.productId] = {
          productId: product.productId,
          productName: product.name,
          batches: [],
        };
      }

      // Append the batch info (expiry date and aggregated quantity)
      categoryMap[catId].products[product.productId].batches.push({
        expiryDate: batch.expiryDate,
        quantity: batch._sum.quantity,
      });
    });

    // Get category details (name) for all categoryIds we have in our result
    const categoryIds = Object.keys(categoryMap).map(Number);
    const categories = await dwhClient.categoryDimension.findMany({
      where: {
        categoryId: { in: categoryIds },
      },
      select: {
        categoryId: true,
        categoryName: true,
      },
    });

    // Map category names back into our categoryMap
    categories.forEach((cat) => {
      if (categoryMap[cat.categoryId]) {
        categoryMap[cat.categoryId].categoryName = cat.categoryName;
      }
    });

    // Convert the categoryMap into an array and also convert the nested product map to an array
    const result = Object.values(categoryMap).map((category) => ({
      categoryId: category.categoryId,
      categoryName: category.categoryName || null,
      products: Object.values(category.products),
    }));

    return res.status(200).json({
      data: result,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports = getCategoriesExpiringSoon;
