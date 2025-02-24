const dwhClient = require("../../prisma/dwh/client");
const winston = require("winston");

const yearlyRevenuePerCategory = async (req, res) => {
  let { year } = req.query;

  if (!year) {
    year = new Date().getFullYear();
  }

  year = +year;

  const businessId = req.user.businessId;

  try {
    // Step 1: Get relevant dateIds for the year 2024
    const dateIds = await dwhClient.dateDimension.findMany({
      where: { year: year },
      select: { dateId: true },
    });

    const dateIdList = dateIds.map((d) => d.dateId);

    // Step 2: Fetch category revenue data using Prisma ORM
    const revenueData = await dwhClient.categoryRevenueFact.groupBy({
      by: ["categoryId"],
      where: {
        businessId: businessId,
        dateId: { in: dateIdList }, // Filter only dates from 2024
      },
      _sum: {
        revenueAmount: true,
        totalUnitsSold: true,
      },
    });

    // Step 3: Fetch category names for the retrieved categoryIds
    const categoryIds = revenueData.map((item) => item.categoryId);
    const categories = await dwhClient.categoryDimension.findMany({
      where: { categoryId: { in: categoryIds } },
      select: { categoryId: true, categoryName: true },
    });

    // Step 4: Merge the results
    const finalResult = revenueData.map((item) => ({
      categoryName: categories.find((cat) => cat.categoryId === item.categoryId)
        ?.categoryName,
      totalRevenue: item._sum.revenueAmount || 0,
      totalUnitsSold: item._sum.totalUnitsSold || 0,
    }));

    // Step 5: Sort by totalRevenue (ascending)
    finalResult.sort((a, b) => a.totalRevenue - b.totalRevenue);

    res.status(200).json({
      year: year,
      data: finalResult,
    });
  } catch (error) {
    winston.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = yearlyRevenuePerCategory;
