const prisma = require("../../prisma/dwh/client");

async function categorySalesTrend(req, res, next) {
  try {
    const businessId = req.user.businessId;

    const { year } = req.params;
    if (!year || isNaN(parseInt(year)))
      throw new Error("Valid year parameter is required");

    const topCategories = await prisma.categoryRevenueFact.groupBy({
      by: ["categoryId"],
      where: { businessId, date: { year: parseInt(year) } },
      _sum: { totalUnitsSold: true },
      orderBy: { _sum: { totalUnitsSold: "desc" } },
      take: 3,
    });

    if (topCategories.length === 0) {
      return res.json({
        message: "No category sales data found for the specified year",
      });
    }

    const topCategoryIds = topCategories.map((c) => c.categoryId);
    const monthlyData = await prisma.categoryRevenueFact.groupBy({
      by: ["categoryId", "dateId"],
      where: {
        businessId,
        categoryId: { in: topCategoryIds },
        date: { year: parseInt(year) },
      },
      _sum: { totalUnitsSold: true },
    });

    const dateIds = monthlyData.map((d) => d.dateId);
    const dates = await prisma.dateDimension.findMany({
      where: { dateId: { in: dateIds } },
      select: { dateId: true, month: true },
    });

    const categories = await prisma.categoryDimension.findMany({
      where: { categoryId: { in: topCategoryIds } },
      select: { categoryId: true, categoryName: true },
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
    categories.forEach((category) => {
      result[category.categoryName] = Object.fromEntries(
        monthNames.map((month) => [month, 0])
      );
    });

    const categoryMap = new Map(
      categories.map((c) => [c.categoryId, c.categoryName])
    );
    const dateMap = new Map(dates.map((d) => [d.dateId, d.month]));

    monthlyData.forEach((data) => {
      const categoryName = categoryMap.get(data.categoryId);
      const month = dateMap.get(data.dateId);
      if (categoryName && month) {
        result[categoryName][monthNames[month - 1]] = data._sum.totalUnitsSold;
      }
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching monthly category sales:", error);
    next(
      error instanceof Error ? error : new Error("An unexpected error occurred")
    );
  }
}

module.exports = categorySalesTrend;
