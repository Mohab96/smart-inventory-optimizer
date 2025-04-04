const prisma = require("../../prisma/dwh/client");

async function productTrend(req, res, next) {
  try {
    const businessId = req.user.businessId;

    const { year } = req.params;
    if (!year || isNaN(parseInt(year)))
      throw new Error("Valid year parameter is required");

    const topProducts = await prisma.productRevenueFact.groupBy({
      by: ["productId"],
      where: { businessId, date: { year: parseInt(year) } },
      _sum: { totalUnitsSold: true },
      orderBy: { _sum: { totalUnitsSold: "desc" } },
      take: 3,
    });

    if (topProducts.length === 0) {
      return res.json({
        message: "No product sales data found for the specified year",
      });
    }

    const topProductIds = topProducts.map((p) => p.productId);
    const monthlyData = await prisma.productRevenueFact.groupBy({
      by: ["productId", "dateId"],
      where: {
        businessId,
        productId: { in: topProductIds },
        date: { year: parseInt(year) },
      },
      _sum: { totalUnitsSold: true },
    });

    const dateIds = monthlyData.map((d) => d.dateId);
    const dates = await prisma.dateDimension.findMany({
      where: { dateId: { in: dateIds } },
      select: { dateId: true, month: true },
    });

    const products = await prisma.productDimension.findMany({
      where: { productId: { in: topProductIds } },
      select: { productId: true, name: true },
    });

    const result = {};
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    products.forEach((product) => {
      result[product.name] = Object.fromEntries(
        monthNames.map((month) => [month, 0])
      );
    });

    const productMap = new Map(products.map((p) => [p.productId, p.name]));
    const dateMap = new Map(dates.map((d) => [d.dateId, d.month]));

    monthlyData.forEach((data) => {
      const productName = productMap.get(data.productId);
      const month = dateMap.get(data.dateId);
      if (productName && month) {
        result[productName][monthNames[month - 1]] = data._sum.totalUnitsSold;
      }
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching monthly product sales:", error);
    next(
      error instanceof Error ? error : new Error("An unexpected error occurred")
    );
  }
}

module.exports = productTrend;
