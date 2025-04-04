const prisma = require("../../prisma/dwh/client");

async function productTrend(req, res, next) {
  try {
    // Extract businessId from the authenticated user
    const businessId = req.user.businessId;

    // Extract year from query parameters
    const { year } = req.params;

    const { page = 1, limit = 10 } = req.query;
    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      isNaN(limitNumber) ||
      limitNumber < 1
    ) {
      return res.status(400).json({
        error:
          "Invalid 'page' or 'limit' values. Both must be positive integers.",
      });
    }

    // Calculate offset for pagination
    const offset = (pageNumber - 1) * limitNumber;

    if (!year || isNaN(parseInt(year))) {
      return res.status(400).json({
        error: "Please provide a valid 'year' in the query parameters.",
      });
    }

    // Raw SQL query to fetch total units sold for each product, grouped by month and year
    const sqlQuery = `
      SELECT 
          pd.name AS product_name,
          dd.month AS month_number,
          COALESCE(SUM(prf."totalUnitsSold"), 0) AS total_units_sold
      FROM 
          "ProductDimension" pd
      CROSS JOIN 
          "DateDimension" dd
      LEFT JOIN 
          "ProductRevenueFact" prf 
              ON pd."productId" = prf."productId"
              AND dd."dateId" = prf."dateId"
      WHERE 
          pd."businessId" = $1
          AND dd.year = $2
      GROUP BY 
          pd.name, dd.month
      ORDER BY 
          pd.name ASC, dd.month ASC
      LIMIT $3 OFFSET $4;
    `;

    // Execute the raw SQL query
    const result = await prisma.$queryRawUnsafe(
      sqlQuery,
      businessId,
      parseInt(year),
      limitNumber * 12,
      offset
    );

    // Format the response
    const formattedResponse = [];

    // Create a map of product names to their monthly sales data
    const productMap = {};

    result.forEach((row) => {
      const productName = row.product_name;
      const monthNumber = row.month_number;
      const totalUnitsSold = Number(row.total_units_sold) || 0;

      if (!productMap[productName]) {
        productMap[productName] = {
          January: 0,
          February: 0,
          March: 0,
          April: 0,
          May: 0,
          June: 0,
          July: 0,
          August: 0,
          September: 0,
          October: 0,
          November: 0,
          December: 0,
        };
      }

      // Map month number to month name
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthName = months[monthNumber - 1];

      // Populate the actual sales data
      productMap[productName][monthName] = totalUnitsSold;
    });

    // Convert the productMap into the desired array format
    for (const [productName, salesData] of Object.entries(productMap)) {
      formattedResponse.push({
        [productName]: salesData,
      });
    }

    // Return the formatted response
    return res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching monthly product sales:", error);
    next(error);
  }
}

module.exports = productTrend;
