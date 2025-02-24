const prisma = require("../../prisma/dwh/client");
const winston = require("winston");
/*
    raw sql queries for each of the following:

- Top sales products ((min 5 products)) (this product has been sold x number of times)

select
  "ProductRevenueFact"."totalUnitsSold",
  "ProductDimension"."name"
from
  "ProductRevenueFact"
  join "ProductDimension" on "ProductRevenueFact"."productId" = "ProductDimension"."productId"
where
  "ProductRevenueFact"."businessId" = 'uuid'
order by
  "ProductRevenueFact"."totalUnitsSold" desc;

- Top sales (products (min 5 products)) for a specific category

SELECT 
  "ProductRevenueFact"."totalUnitsSold", "ProductDimension".name 
FROM
  "ProductRevenueFact" 
JOIN 
  "ProductDimension"
ON 
  "ProductRevenueFact"."productId" = "ProductDimension"."productId"
WHERE 
  "ProductDimension"."categoryId" = 4 and "ProductRevenueFact"."businessId" ='uuid'
ORDER BY 
  "ProductRevenueFact"."totalUnitsSold" DESC

- Top sales (products (min 5 products)) for a specific month/year

SELECT 
  "ProductRevenueFact"."totalUnitsSold", "ProductDimension".name 
FROM
  "ProductRevenueFact" 
JOIN 
  "ProductDimension"
ON 
  "ProductRevenueFact"."productId" = "ProductDimension"."productId"
JOIN 
  "DateDimension"
ON  
  "ProductRevenueFact"."dateId" = "DateDimension"."dateId"
WHERE 
  "ProductDimension"."categoryId" = 4 and "ProductRevenueFact"."businessId" ='uuid' and "DateDimension".month = 1
ORDER BY 
  "ProductRevenueFact"."totalUnitsSold" DESC
  
*/
const productsSalesController = async (req, res, next) => {
  /// optional filters
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const businessId = req.user.businessId;
  const order = req.query.orderBy || "desc";
  const category = req.query.category || null; /// category id
  const month = +req.query.month || null;
  const year = +req.query.year || null;
  if (category) {
    try {
      const results = await prisma.productRevenueFact.findMany({
        where: {
          businessId: businessId,
          product: {
            categoryId: category,
          },
        },
        select: {
          totalUnitsSold: true,
          product: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          totalUnitsSold: order,
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      return res.status(200).json({
        data: results,
      });
    } catch (error) {
      winston.error(error);
      return res.status(500).json({ message: "Internal Server error" });
    }
  }
  if (!category || !month || !year) {
    try {
      const results = await prisma.productRevenueFact.findMany({
        where: {
          businessId,
        },
        select: {
          totalUnitsSold: true,
          product: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          totalUnitsSold: order,
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      return res.status(200).json({
        data: results,
      });
    } catch (error) {
      winston.error(error);
      return res.status(500).json({ message: "Internal Server error" });
    }
  }
  if (month || year) {
    date =
      month && year
        ? { month: month, year: year }
        : year
        ? { year: year }
        : { month: month };
    try {
      const results = await prisma.productRevenueFact.findMany({
        where: {
          businessId,
          date: date,
        },
        select: {
          totalUnitsSold: true,
          product: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          totalUnitsSold: order,
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      return res.status(200).json({
        data: results,
      });
    } catch (error) {
      winston.error(error);
      return res.status(500).json({ message: "Internal Server error" });
    }
  }
};

module.exports = productsSalesController;
