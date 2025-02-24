const dwhClient = require("../../prisma/dwh/client");

const getTotalRevenueByQuarter = async (req, res, next) => {
  const currentYear = new Date().getFullYear();
  const yearParam = req.query.year || currentYear;
  const businessId = req.user.businessId;
  const numericYear = parseInt(yearParam, 10);

  if (isNaN(numericYear)) {
    return res.status(400).json({ error: "Invalid year parameter" });
  }

  try {
    const dateRecords = await dwhClient.dateDimension.findMany({
      where: {
        year: numericYear,
      },
      select: {
        dateId: true,
        quarter: true,
      },
    });

    // Group dateIds by quarter.
    const quarterDateIds = dateRecords.reduce((acc, record) => {
      const { quarter, dateId } = record;
      if (!acc[quarter]) {
        acc[quarter] = [];
      }
      acc[quarter].push(dateId);
      return acc;
    }, {});
    let totalRevenue = 0;
    // For each quarter (1 to 4), aggregate the total revenue.
    const quarterPromises = [1, 2, 3, 4].map(async (quarter) => {
      const dateIdsForQuarter = quarterDateIds[quarter] || [];
      let revenue = "0";
      if (dateIdsForQuarter.length > 0) {
        const aggregateResult = await dwhClient.productRevenueFact.aggregate({
          _sum: {
            revenueAmount: true,
          },
          where: {
            businessId: businessId,
            dateId: { in: dateIdsForQuarter },
          },
        });
        revenue = aggregateResult._sum.revenueAmount
          ? aggregateResult._sum.revenueAmount.toString()
          : "0";
        totalRevenue += aggregateResult._sum.revenueAmount;
      }
      return {
        quarter,
        totalRevenue: revenue,
      };
    });

    const quarterlyResults = await Promise.all(quarterPromises);

    return res.status(200).json({
      data: {
        year: numericYear,
        quarterlyRevenue: quarterlyResults,
        totalRevenue: totalRevenue.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getTotalRevenueByQuarter;
