const winston = require("winston");
const dwhClient = require("../../prisma/dwh/client");

const yearlyRevenuePerMonth = async (req, res) => {
  let { year } = req.query;
  year = +year || new Date().getFullYear(); // Convert to number or default to current year
  const businessId = req.user.businessId;

  try {
    // Predefined month names for efficient mapping
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

    // Raw SQL query to aggregate revenue by month
    const revenueRecords = await dwhClient.$queryRaw`
      SELECT 
        dd.month,
        SUM(prf."revenueAmount") AS total_revenue
      FROM "ProductRevenueFact" prf
      JOIN "DateDimension" dd ON prf."dateId" = dd."dateId"
      WHERE prf."businessId" = ${businessId} AND dd.year = ${year}
      GROUP BY dd.month
      ORDER BY dd.month ASC
    `;

    // Initialize monthly revenue object with all months set to 0
    const monthlyRevenue = Object.fromEntries(
      monthNames.map((name) => [name, 0])
    );

    // Aggregate revenue into monthly buckets
    revenueRecords.forEach((record) => {
      const monthNumber = record.month; // 1-12
      const monthName = monthNames[monthNumber - 1]; // Map to name (0-based index)
      const revenue = parseFloat(record.total_revenue || 0);
      monthlyRevenue[monthName] = revenue; // Direct assignment since grouped by month
    });

    res.status(200).json({ year, data: monthlyRevenue });
  } catch (error) {
    winston.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = yearlyRevenuePerMonth;
