const prisma = require("../../prisma/dwh/client");

/*
  Top sales categories (min 5 products)
SELECT 
  "CategoryRevenueFact"."totalUnitsSold", 
  "CategoryDimension"."categoryName"
FROM 
  "CategoryRevenueFact"
JOIN 
  "CategoryDimension"
  ON "CategoryRevenueFact"."categoryId"= "CategoryDimension"."categoryId"
WHERE 
  "CategoryRevenueFact"."businessId" = 'uuid'
ORDER BY 
  "CategoryRevenueFact"."totalUnitsSold" DESC;
*/
const categorySalesController = async (req, res, next) => {
  /// optional filters
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const businessId = req.user.businessId;
  const order = req.query.orderBy || "desc";
  try {
    const results = await prisma.categoryRevenueFact.findMany({
      where: {
        businessId,
      },
      select: {
        totalUnitsSold: true,
        category: {
          select: {
            categoryName: true,
          },
        },
      },
      orderBy: {
        totalUnitsSold: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return res.status(200).json({ data: results });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = categorySalesController;
