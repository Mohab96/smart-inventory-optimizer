const winston = require("winston");
const dwhClient = require("../../prisma/dwh/client");

const yearlyRevenuePerMonth = async (req, res) => {
  let { year } = req.query;

  year = +year;

  if (!year) {
    year = new Date().getFullYear();
  }

  const businessId = req.user.businessId;

  try {
    const dateIds = await dwhClient.dateDimension.findMany({
      where: { year: year },
      select: { dateId: true },
    });

    const dateIdList = dateIds.map((d) => d.dateId);

    const revenueRecords = await dwhClient.productRevenueFact.findMany({
      where: {
        AND: [{ dateId: { in: dateIdList } }, { businessId: businessId }],
      },
      include: { date: true },
    });

    // Initialize an object to accumulate revenue per month
    const monthlyRevenue = {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    };

    revenueRecords.forEach((record) => {
      // The date relation gives us the month (1-12)
      const monthNumber = record.date.month;
      // Convert month number to a lowercase month name (e.g., 1 -> "january")
      const monthName = new Date(0, monthNumber - 1)
        .toLocaleString("en-US", { month: "long" })
        .toLowerCase();
      // Parse the revenueAmount (Decimal) into a number
      const revenue = parseFloat(record.revenueAmount);

      // Accumulate revenue per month
      if (monthlyRevenue[monthName]) {
        monthlyRevenue[monthName] += revenue;
      } else {
        monthlyRevenue[monthName] = revenue;
      }
    });

    res.status(200).json({ year, data: monthlyRevenue });
  } catch (error) {
    winston.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = yearlyRevenuePerMonth;
