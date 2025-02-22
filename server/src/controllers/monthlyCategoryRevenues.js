const dwhClient = require("../../prisma/dwh/client");

function generateMonthRange(start, end) {
  const months = [];
  // Start at the first day of the start month.
  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  // End at the first day of the month for the end date.
  const last = new Date(end.getFullYear(), end.getMonth(), 1);
  while (current <= last) {
    const monthStr = `${current.getFullYear()}-${String(
      current.getMonth() + 1
    ).padStart(2, "0")}`;
    months.push(monthStr);
    current.setMonth(current.getMonth() + 1);
  }
  return months;
}

const getMonthlyCategoryRevenues = async (req, res, next) => {
  const businessId = req.user.businessId;
  const { startDate, endDate } = req.query;

  // Validate query parameters
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "startDate and endDate are required" });
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    // Retrieve CategoryRevenueFact records for the business in the given date range.
    // We filter on the related DateDimension.fullDate field.
    const facts = await dwhClient.categoryRevenueFact.findMany({
      where: {
        businessId: businessId,
        date: {
          fullDate: {
            gte: start,
            lte: end,
          },
        },
      },
      include: {
        date: {
          select: {
            month: true,
            year: true,
          },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
      },
    });

    // Aggregate the revenues by category and by month.
    // The month key is built as "YYYY-MM" using the related date info.
    const aggregated = {};
    facts.forEach((fact) => {
      const { categoryId, revenueAmount } = fact;
      // Build month key from date relation (pad the month with a leading zero if needed)
      const monthKey = `${fact.date.year}-${String(fact.date.month).padStart(
        2,
        "0"
      )}`;
      if (!aggregated[categoryId]) {
        aggregated[categoryId] = {
          categoryName: fact.category.categoryName,
          monthly: {},
        };
      }
      // Sum the revenue (convert to float; adjust if you use a Decimal library)
      if (!aggregated[categoryId].monthly[monthKey]) {
        aggregated[categoryId].monthly[monthKey] = 0;
      }
      aggregated[categoryId].monthly[monthKey] += parseFloat(revenueAmount);
    });

    // Generate the full list of months between startDate and endDate.
    const monthRange = generateMonthRange(start, end);

    // For each category, ensure that every month in the range is present in the output.
    const result = Object.keys(aggregated).map((catId) => {
      const { categoryName, monthly } = aggregated[catId];
      const monthlyRevenues = monthRange.map((month) => ({
        month,
        revenue: monthly[month] || 0,
      }));
      return {
        categoryId: parseInt(catId, 10),
        categoryName,
        monthlyRevenues,
      };
    });

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = getMonthlyCategoryRevenues;
