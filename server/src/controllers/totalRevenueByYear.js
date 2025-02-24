const dwhClient = require("../../prisma/dwh/client");

const getTotalRevenueByYear = async (req, res, next) => {
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
      },
    });

    const dateIds = dateRecords.map((record) => record.dateId);

    const aggregateResult = await dwhClient.productRevenueFact.aggregate({
      _sum: {
        revenueAmount: true,
      },
      where: {
        businessId: businessId,
        dateId: { in: dateIds },
      },
    });
    const totalRevenue = aggregateResult._sum.revenueAmount
      ? aggregateResult._sum.revenueAmount.toString()
      : "0";

    return res.status(200).json({
      data: {
        year: numericYear,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getTotalRevenueByYear;
